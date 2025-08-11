import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.previousData = {};
  }

  async requestPermissions() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('dclone-progress', {
          name: 'Diablo Clone Progress',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FFD700',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  generateServerKey(regionName, ladderName, coreName) {
    return `${regionName.toLowerCase()}-${ladderName.toLowerCase().replace('-', '')}-${coreName.toLowerCase()}`;
  }

  async checkForProgressChanges(newData) {
    try {
      // Check if notifications are enabled globally
      const notificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');
      if (!notificationsEnabled || !JSON.parse(notificationsEnabled)) {
        return;
      }

      // Get notification settings
      const settingsString = await AsyncStorage.getItem('notificationSettings');
      if (!settingsString) {
        return;
      }

      const notificationSettings = JSON.parse(settingsString);

      // Check each server for progress changes
      for (const serverData of newData) {
        const serverKey = this.generateServerKey(
          serverData.regionName, 
          serverData.ladderName, 
          serverData.coreName
        );

        // Only check servers that user wants notifications for
        if (!notificationSettings[serverKey]) {
          continue;
        }

        const currentProgress = parseInt(serverData.progress);
        const previousProgress = this.previousData[serverKey] || 0;

        // If progress increased, send notification
        if (currentProgress > previousProgress) {
          await this.sendProgressNotification(serverData, currentProgress, previousProgress);
        }

        // Update stored progress
        this.previousData[serverKey] = currentProgress;
      }
    } catch (error) {
      console.error('Error checking for progress changes:', error);
    }
  }

  async sendProgressNotification(serverData, currentProgress, previousProgress) {
    try {
      const title = '🔥 Diablo Clone Progress Update!';
      const body = `${serverData.regionName} ${serverData.ladderName} ${serverData.coreName}\nProgress: [${currentProgress}/6] (was [${previousProgress}/6])`;
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { 
            serverData,
            currentProgress,
            previousProgress 
          },
          sound: 'default',
        },
        trigger: null, // Send immediately
      });

      console.log(`Sent notification for ${serverData.regionName} ${serverData.ladderName} ${serverData.coreName}: ${previousProgress} -> ${currentProgress}`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async initializePreviousData(initialData) {
    try {
      // Initialize previous data with current progress values
      for (const serverData of initialData) {
        const serverKey = this.generateServerKey(
          serverData.regionName, 
          serverData.ladderName, 
          serverData.coreName
        );
        this.previousData[serverKey] = parseInt(serverData.progress);
      }
      console.log('Initialized previous data for notifications:', this.previousData);
    } catch (error) {
      console.error('Error initializing previous data:', error);
    }
  }
}

export default new NotificationService();