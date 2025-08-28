// App.js
import React, { useState } from "react";
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import GalleryPicker from "./components/GalleryPicker";
import CameraScreen from "./components/CameraScreen";
import DailyLogScreen from "./components/DailyLogScreen";
import ProfileScreen from "./components/ProfileScreen";

export default function App() {
    const [userGoals, setUsergoals] = useState({
    calorieGoal: 2000,
    proteinGoal: 100,
    carbsGoal: 250,
  });

  const [screen, setScreen] = useState("home"); 

  return (
    <SafeAreaView style={{ flex: 1 }}>
     
     {screen === "home" && (
  <ScrollView contentContainerStyle={styles.homeContainer}>
    <View style={styles.homeContent}>
      {/* Logo anf Title */}
      <View style={styles.header}>
        <Text style={styles.logo}>🥗</Text>
        <Text style={styles.title}>NutriChoice</Text>
        <Text style={styles.subtitle}>Smart Food Recognition</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
                onPress={() => setScreen("profile")}
                style={[styles.card, { backgroundColor: "#9C27B0" }]}
              >
                <Text style={styles.cardIcon}>👤</Text>
                <Text style={styles.cardText}>Set Profile</Text>
              </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setScreen("camera")}
          style={[styles.card, { backgroundColor: "#4CAF50" }]}
        >
          <Text style={styles.cardIcon}>📸</Text>
          <Text style={styles.cardText}>Open Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setScreen("gallery")}
          style={[styles.card, { backgroundColor: "#2196F3" }]}
        >
          <Text style={styles.cardIcon}>🖼️</Text>
          <Text style={styles.cardText}>Pick from Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setScreen("log")}
          style={[styles.card, { backgroundColor: "#FF9800" }]}
        >
          <Text style={styles.cardIcon}>📒</Text>
          <Text style={styles.cardText}>View Daily Log</Text>
        </TouchableOpacity>  
      </View>
    </View>
  </ScrollView>
)}

      {screen === "camera" && <CameraScreen onClose={() => setScreen("home")} />}
      {screen === "gallery" && <GalleryPicker onClose={() => setScreen("home")} />}

{screen === "log" && (
  <DailyLogScreen
    calorieGoal={userGoals.calorieGoal}
    proteinGoal={userGoals.proteinGoal}
    carbsGoal={userGoals.carbsGoal}
    onClose={() => setScreen("home")}
  />
)}

{screen === "profile" && (
  <ProfileScreen
    onSave={(newGoals) => setUsergoals(newGoals)}

    onClose={() => setScreen("home")}
  />
)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flexGrow: 1,
    backgroundColor: "#121212", 
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  homeContent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff", 
  },
  subtitle: {
    fontSize: 15,
    color: "#aaa",
    marginTop: 4,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  
  card: {
  width: "92%",
  marginVertical: 12,
  paddingVertical: 26,
  borderRadius: 18,
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden", 
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 6,
},
cardText: {
  fontSize: 18,
  fontWeight: "600",
  color: "#fff", 
},

  cardIcon: {
    fontSize: 34,
    marginBottom: 10,
    color: "#FF9800",
  },

  screenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  screenText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#bbb",
  },
  backButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: "#FF9800",
    borderRadius: 12,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
