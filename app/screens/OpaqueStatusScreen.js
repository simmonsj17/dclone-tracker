import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import colors from "../config/colors";

function OpaqueStatusScreen({ regionData, core, ladder }) {
  console.log("OpaqueStatusScreen - regionData length:", regionData.length);
  console.log("OpaqueStatusScreen - core:", core, "ladder:", ladder);
  console.log("OpaqueStatusScreen - sample data:", regionData[0]);

  const timeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp * 1000) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + " years ago";
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + " months ago";
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + " days ago";
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + " hours ago";
    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  // Filter data based on current settings (no API calls - just filter cached data)
  const filteredData = regionData.filter(data => {
    return data.coreName === core && data.ladderName === ladder;
  });

  // Sort by progress (highest first), then by region
  const sortedData = filteredData.sort((a, b) => {
    if (b.progress !== a.progress) {
      return b.progress - a.progress;
    }
    return a.regionName.localeCompare(b.regionName);
  });

  return (
    <View style={styles.container}>
      <View style={{ padding: 16 }}>
        <Text style={styles.infoText}>
          {ladder} | {core}
        </Text>
      </View>
      {sortedData.map((data, index) => (
        <View key={index} style={styles.regionInfoContainer}>
          <Text style={styles.text}>Region: {data.regionName}</Text>
          <Text style={styles.text}>Progress: [{data.progress}/6] </Text>
          <Text style={styles.text}>{timeAgo(data.timestamped)}</Text>
        </View>
      ))}
      {sortedData.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.important} />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    opacity: 0.8,
  },
  regionInfoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderColor: colors.border,
    borderWidth: 2,
  },
  text: {
    fontFamily: "AvQest",
    color: colors.important,
    fontSize: 24,
    marginBottom: 8,
  },
  infoText: {
    fontFamily: "AvQest",
    color: colors.important,
    fontSize: 26,
    marginBottom: 10,
    textAlign: "center",
  },
  loadingContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.border,
    borderWidth: 1,
    minHeight: 120,
  },
  loadingText: {
    fontFamily: "AvQest",
    color: colors.important,
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
});

export default OpaqueStatusScreen;
