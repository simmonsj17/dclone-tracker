import React, { useState, useContext, useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Switch,
  Text,
  Linking,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";

import colors from "./../config/colors";
import OpaqueStatusScreen from "./OpaqueStatusScreen";
import SettingsContext from "./SettingsContext";

function buildApiUrl(region, ladder, core) {
  let apiUrl = "https://diablo2.io/dclone_api.php?";
  
  if (region) apiUrl += `region=${region}&`;
  if (ladder) apiUrl += `ladder=${ladder}&`;
  if (core) apiUrl += `hc=${core}`;

  return apiUrl;
}

async function fetchAllServerData() {
  try {
    const apiUrl = "https://diablo2.io/dclone_api.php"; // No parameters = get ALL data
    console.log("Fetching all server data from:", apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Add metadata to each entry
    data.forEach(entry => {
      entry.regionName = entry.region === "1" ? "Americas" : entry.region === "2" ? "Europe" : "Asia";
      entry.ladderName = entry.ladder === "1" ? "Ladder" : "Non-Ladder";
      entry.coreName = entry.hc === "1" ? "Hardcore" : "Softcore";
    });
    
    console.log(`Successfully fetched ${data.length} server combinations`);
    return data;
    
  } catch (error) {
    console.error("Error fetching all server data:", error);
    throw error;
  }
}

function WelcomeScreen(props) {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const { core, ladder } = useContext(SettingsContext);
  const [allServerData, setAllServerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const openSettingsScreen = () => navigation.navigate("Settings");
  console.log("Variables loaded, App loading");

  useEffect(() => {
    let timer;

    async function fetchData() {
      if (!isEnabled) return;
      
      setIsLoading(true);
      console.log("Starting to fetch all server data...");

      try {
        const allData = await fetchAllServerData();
        console.log(`Fetched data for ${allData.length} server combinations`);
        setAllServerData(allData);
      } catch (error) {
        console.error("Error fetching all server data:", error);
        // Don't show error alert - just keep using the last cached data
        // Only show alert if it's not a rate limiting issue
        if (!error.message.includes("429")) {
          Alert.alert("Error fetching data - Diablo2.io site may be down.");
        } else {
          console.log("Rate limited - continuing with cached data");
        }
      } finally {
        setIsLoading(false);
        // Set a timer to fetch all data again after 60 seconds (regardless of success/failure)
        timer = setTimeout(fetchData, 60 * 1000);
      }
    }

    fetchData();

    // Cleanup function to clear the timer when the component unmounts or dependencies change
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isEnabled]);

  return (
    <View style={styles.container}>
      <View style={styles.appbanner}>
        <Text style={styles.bannertext}> Dclone Tracker</Text>
      </View>
      <ImageBackground
        style={styles.mainImage}
        source={require("../assets/background.png")}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.settingsContainer}>
            <View style={styles.toggleContainer}>
              <Text
                style={{
                  color: isEnabled ? colors.onStatus : colors.offStatus,
                  fontWeight: "bold",
                }}
              >
                {isEnabled ? "ON" : "OFF"}
              </Text>
              <Switch
                trackColor={{ false: colors.secondary, true: "#81b0ff" }}
                thumbColor={isEnabled ? colors.primary : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={openSettingsScreen}
            >
              <Icon name="cog" size={30} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.opaqueBox}>
          {isEnabled ? (
            isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>
                  Loading all servers...
                </Text>
              </View>
            ) : (
              <OpaqueStatusScreen
                regionData={allServerData}
                core={core}
                ladder={ladder}
              />
            )
          ) : null}
        </View>
      </ImageBackground>
      <View style={styles.creditsbanner}>
        <View style={styles.credits}>
          <Text style={{ color: colors.white }}>Data courtesy of </Text>
          <Text
            style={{
              color: colors.important,
              fontSize: 20,
              paddingHorizontal: 2,
              fontWeight: "bold",
            }}
            onPress={() =>
              Linking.openURL("https://diablo2.io/dclonetracker.php")
            }
          >
            Diablo2.io
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  mainImage: {
    flex: 1,
  },
  appbanner: {
    width: "100%",
    height: 100,
    borderBottomWidth: 2,
    borderColor: colors.border,

    backgroundColor: colors.primary,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: colors.primary,
    width: 80,
    height: 50,
  },
  contentWrapper: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },

  creditsbanner: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderTopWidth: 2,
    borderColor: colors.border,
    height: 60,
    marginBottom: 40,
  },
  credits: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannertext: {
    textAlign: "center",
    color: colors.black,
    fontSize: 45,
    fontFamily: "AvQest",
    paddingTop: 30,
  },
  opaqueBox: {
    flex: 1,
    position: "absolute",
    paddingTop: 80,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: "center",
  },
  settingsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  settingsButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: colors.primary,
    opacity: 0.8,
  },
  loadingContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  loadingText: {
    color: colors.important,
    fontSize: 26,
    fontFamily: 'AvQest',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
