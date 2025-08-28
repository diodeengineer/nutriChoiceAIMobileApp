// components/ProfileScreen.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function ProfileScreen({ onSave, onClose }) {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [activity, setActivity] = useState("moderate"); // sedentary, moderate, active
  const [gender, setGender] = useState("male"); // male / female

 async function handleSave() {
  const goals = calculateGoals(Number(weight), Number(height), Number(age), gender, activity);

  // profile object
  const profile = {
    weight,
    height,
    age,
    gender,
    activity,
    goals, // store calculated goals
  };

  // save to AsyncStorage
  await AsyncStorage.setItem("userProfile", JSON.stringify(profile));

  onSave(goals); // pass goals back to app
  onClose();
}



  // Load profile when screen opens
useEffect(() => {
  (async () => {
    const savedProfile = await AsyncStorage.getItem("userProfile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setWeight(parsed.weight);
      setHeight(parsed.height);
      setAge(parsed.age);
      setGender(parsed.gender);
      setActivity(parsed.activity);
    }
  })();
}, []);

 function calculateGoals(weight, height, age, activity, gender = "male") {
  // BMR (Harris-Benedict Equation)
  let BMR;
  if (gender === "male") {
    BMR = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    BMR = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multipliers 
  let multiplier = 1.55; // default moderate
  let proteinFactor = 1.6; // default moderate

  if (activity === "sedentary") {
    multiplier = 1.2;
    proteinFactor = 1.0;
  }
  if (activity === "moderate") {
    multiplier = 1.55;
    proteinFactor = 1.6;
  }
  if (activity === "active") {
    multiplier = 1.725;
    proteinFactor = 2.0; // gym/athletes
  }

  // Goals
  const calories = Math.round(BMR * multiplier);
  const protein = Math.round(weight * proteinFactor); // gm/day
  const carbs = Math.round((calories * 0.5) / 4); // 50% calories from carbs

  return { calorieGoal: calories, proteinGoal: protein, carbsGoal: carbs };
}


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Profile</Text>

      <TextInput
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        style={styles.input}
      />
      <TextInput
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
        style={styles.input}
      />
      <TextInput
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
        style={styles.input}
      />

      {/* Activity selection */}
<View style={styles.row}>
  <TouchableOpacity
    style={[styles.option, activity === "sedentary" && styles.active]}
    onPress={() => setActivity("sedentary")}
  >
    <Text style={styles.optionText}>Sedentary</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.option, activity === "moderate" && styles.active]}
    onPress={() => setActivity("moderate")}
  >
    <Text style={styles.optionText}>Moderate</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.option, activity === "active" && styles.active]}
    onPress={() => setActivity("active")}
  >
    <Text style={styles.optionText}>Active</Text>
  </TouchableOpacity>
</View>


      {/* Gender selection */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.option, gender === "male" && styles.active]}
          onPress={() => setGender("male")}
        >
          <Text style={styles.optionText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, gender === "female" && styles.active]}
          onPress={() => setGender("female")}
        >
          <Text style={styles.optionText}>Female</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  row: { flexDirection: "row", marginVertical: 10 },
  option: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 5,
  },
  active: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  optionText: { color: "#000" },
  saveBtn: { backgroundColor: "#4CAF50", padding: 14, borderRadius: 10, marginTop: 20 },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cancelBtn: { marginTop: 10 },
  cancelText: { color: "#555" },
});
