import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import colors from "../config/colors";
import SettingsContext from "./SettingsContext.js";

function SettingOption({ label, onPress, isSelected }) {
  return (
    <TouchableOpacity style={styles.settingOption} onPress={onPress}>
      <Icon
        name={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
        size={24}
        color={colors.important}
      />
      <Text style={styles.settingOptionText}>{label}</Text>
    </TouchableOpacity>
  );
}

function SettingsScreen() {
  const { core, setCore, ladder, setLadder } = useContext(SettingsContext);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <Text style={styles.settingCategory}>Core:</Text>
      <View style={styles.settingOptions}>
        <SettingOption
          label="Softcore"
          isSelected={core === "Softcore"}
          onPress={() => setCore("Softcore")}
        />
        <SettingOption
          label="Hardcore"
          isSelected={core === "Hardcore"}
          onPress={() => setCore("Hardcore")}
        />
      </View>

      <Text style={styles.settingCategory}>Ladder:</Text>
      <View style={styles.settingOptions}>
        <SettingOption
          label="Ladder"
          isSelected={ladder === "Ladder"}
          onPress={() => setLadder("Ladder")}
        />
        <SettingOption
          label="Non-Ladder"
          isSelected={ladder === "Non-Ladder"}
          onPress={() => setLadder("Non-Ladder")}
        />
      </View>

      <TouchableOpacity 
        style={styles.notificationButton} 
        onPress={() => navigation.navigate("Notifications")}
      >
        <Icon name="bell-outline" size={24} color={colors.important} />
        <Text style={styles.notificationButtonText}>Notification Settings</Text>
        <Icon name="chevron-right" size={24} color={colors.important} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={() => navigation.goBack()}
      >
        <Icon name="content-save" size={24} color={colors.primary} />
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  header: {
    //fontFamily: "AvQest",
    fontSize: 30,
    color: colors.important,
    marginBottom: 20,
  },
  settingCategory: {
    //fontFamily: "AvQest",
    fontSize: 20,
    color: colors.important,
    marginTop: 15,
    marginBottom: 5,
  },
  settingOptions: {
    flexDirection: "row",
    justifyContent: "center",
  },
  settingOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.black,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    margin: 10,
  },
  settingOptionText: {
    //fontFamily: "AvQest",
    fontSize: 18,
    color: colors.important,
    marginLeft: 10,
  },
  notificationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.black,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 10,
    margin: 20,
    marginTop: 30,
    borderWidth: 2,
    borderColor: colors.border,
  },
  notificationButtonText: {
    flex: 1,
    fontSize: 18,
    color: colors.important,
    marginLeft: 12,
    fontWeight: "bold",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.important,
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    color: colors.primary,
    marginLeft: 8,
    fontWeight: "bold",
  },
});

export default SettingsScreen;
