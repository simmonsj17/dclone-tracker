import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../config/colors";

const serverOptions = [
  { key: "americas-ladder-hardcore", label: "Americas Ladder Hardcore", region: "Americas", ladder: "Ladder", core: "Hardcore" },
  { key: "americas-ladder-softcore", label: "Americas Ladder Softcore", region: "Americas", ladder: "Ladder", core: "Softcore" },
  { key: "americas-nonladder-hardcore", label: "Americas Non-Ladder Hardcore", region: "Americas", ladder: "Non-Ladder", core: "Hardcore" },
  { key: "americas-nonladder-softcore", label: "Americas Non-Ladder Softcore", region: "Americas", ladder: "Non-Ladder", core: "Softcore" },
  
  { key: "europe-ladder-hardcore", label: "Europe Ladder Hardcore", region: "Europe", ladder: "Ladder", core: "Hardcore" },
  { key: "europe-ladder-softcore", label: "Europe Ladder Softcore", region: "Europe", ladder: "Ladder", core: "Softcore" },
  { key: "europe-nonladder-hardcore", label: "Europe Non-Ladder Hardcore", region: "Europe", ladder: "Non-Ladder", core: "Hardcore" },
  { key: "europe-nonladder-softcore", label: "Europe Non-Ladder Softcore", region: "Europe", ladder: "Non-Ladder", core: "Softcore" },
  
  { key: "asia-ladder-hardcore", label: "Asia Ladder Hardcore", region: "Asia", ladder: "Ladder", core: "Hardcore" },
  { key: "asia-ladder-softcore", label: "Asia Ladder Softcore", region: "Asia", ladder: "Ladder", core: "Softcore" },
  { key: "asia-nonladder-hardcore", label: "Asia Non-Ladder Hardcore", region: "Asia", ladder: "Non-Ladder", core: "Hardcore" },
  { key: "asia-nonladder-softcore", label: "Asia Non-Ladder Softcore", region: "Asia", ladder: "Non-Ladder", core: "Softcore" },
];

function NotificationItem({ option, isEnabled, onToggle }) {
  return (
    <View style={styles.notificationItem}>
      <View style={styles.itemContent}>
        <Text style={styles.itemLabel}>{option.label}</Text>
        <Text style={styles.itemDetails}>
          Get notified when progress increases
        </Text>
      </View>
      <Switch
        trackColor={{ false: colors.secondary, true: "#81b0ff" }}
        thumbColor={isEnabled ? colors.primary : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onToggle}
        value={isEnabled}
      />
    </View>
  );
}

function NotificationScreen() {
  const [notificationSettings, setNotificationSettings] = useState({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem("notificationSettings");
      const globalEnabled = await AsyncStorage.getItem("notificationsEnabled");
      
      if (settings) {
        setNotificationSettings(JSON.parse(settings));
      }
      
      if (globalEnabled) {
        setNotificationsEnabled(JSON.parse(globalEnabled));
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  };

  const saveNotificationSettings = async (settings) => {
    try {
      await AsyncStorage.setItem("notificationSettings", JSON.stringify(settings));
      setNotificationSettings(settings);
    } catch (error) {
      console.error("Error saving notification settings:", error);
    }
  };

  const toggleNotificationForServer = (serverKey) => {
    const newSettings = {
      ...notificationSettings,
      [serverKey]: !notificationSettings[serverKey]
    };
    saveNotificationSettings(newSettings);
  };

  const toggleAllNotifications = async () => {
    const newEnabled = !notificationsEnabled;
    setNotificationsEnabled(newEnabled);
    try {
      await AsyncStorage.setItem("notificationsEnabled", JSON.stringify(newEnabled));
    } catch (error) {
      console.error("Error saving global notification setting:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Notification Settings</Text>
      
      <View style={styles.globalToggleContainer}>
        <View style={styles.globalToggleContent}>
          <Icon name="bell-outline" size={24} color={colors.important} />
          <View style={styles.globalToggleText}>
            <Text style={styles.globalToggleTitle}>Enable Notifications</Text>
            <Text style={styles.globalToggleSubtitle}>
              Turn on notifications for Diablo Clone progress
            </Text>
          </View>
        </View>
        <Switch
          trackColor={{ false: colors.secondary, true: "#81b0ff" }}
          thumbColor={notificationsEnabled ? colors.primary : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleAllNotifications}
          value={notificationsEnabled}
        />
      </View>

      {notificationsEnabled && (
        <>
          <Text style={styles.sectionHeader}>Select Servers to Track</Text>
          <Text style={styles.sectionSubtitle}>
            Choose which servers you want to receive notifications for when progress increases
          </Text>
          
          {serverOptions.map((option) => (
            <NotificationItem
              key={option.key}
              option={option}
              isEnabled={!!notificationSettings[option.key]}
              onToggle={() => toggleNotificationForServer(option.key)}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 20,
  },
  header: {
    fontSize: 30,
    color: colors.important,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "AvQest",
  },
  globalToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.black,
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  globalToggleContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  globalToggleText: {
    flex: 1,
    marginLeft: 12,
  },
  globalToggleTitle: {
    fontSize: 18,
    color: colors.important,
    fontWeight: "bold",
    fontFamily: "AvQest",
  },
  globalToggleSubtitle: {
    fontSize: 14,
    color: colors.white,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 20,
    color: colors.important,
    marginBottom: 8,
    fontFamily: "AvQest",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 16,
    lineHeight: 20,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.black,
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    color: colors.important,
    fontWeight: "bold",
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 12,
    color: colors.white,
  },
});

export default NotificationScreen;