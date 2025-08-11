import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import { enableScreens } from "react-native-screens";
import "react-native-gesture-handler";

import WelcomeScreen from "./app/screens/WelcomeScreen";
import SettingsScreen from "./app/screens/SettingsScreen";
import SettingsContext from "./app/screens/SettingsContext";

enableScreens();

const Stack = createStackNavigator();
const fetchFonts = () => {
  return Font.loadAsync({
    AvQest: require("./app/assets/fonts/AvQest.ttf"),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [core, setCore] = useState("Softcore");
  const [ladder, setLadder] = useState("Ladder");

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await fetchFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!fontsLoaded) {
    return null;
  }
  console.log("Loading Welcome Screen");
  return (
    <SettingsContext.Provider value={{ core, setCore, ladder, setLadder }}>
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SettingsContext.Provider>
  );
}
