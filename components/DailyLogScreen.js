//components/DailyLogScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import * as Progress from "react-native-progress"; 
import { getLog, updateLog } from "../utils/storage";

export default function DailyLogScreen({ onClose,  calorieGoal, proteinGoal, carbsGoal }) {

  const [log, setLog] = useState([]);

  useEffect(() => {
    const fetchLog = async () => {
      const data = await getLog();
      setLog(data.reverse());
    };
    fetchLog();
  }, []);

  const onCancel = async (index) => {
    const updatedLog = [...log];
    updatedLog.splice(index, 1);
    setLog(updatedLog);
    await updateLog(updatedLog);
  };

 
  // totals (apply quantity multiplier)
const totalCalories = log.reduce(
  (sum, item) => sum + Number(item.calories || 0) * (item.quantity || 1),
  0
);
const totalProtein = log.reduce(
  (sum, item) => sum + Number(item.protein || 0) * (item.quantity || 1),
  0
);
const totalCarbs = log.reduce(
  (sum, item) => sum + Number(item.carbs || 0) * (item.quantity || 1),
  0
);


    const adjustQuantity = async (index, delta) => {
  const updatedLog = [...log];
  updatedLog[index].quantity = Math.max(1, updatedLog[index].quantity + delta);
  setLog(updatedLog);
  await updateLog(updatedLog);
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📒 Daily Food Log</Text>

      {/* Summary card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Today’s Progress</Text>

        <Text style={styles.progressLabel}>
          Calories: {totalCalories} / {calorieGoal} kcal
        </Text>
        <Progress.Bar
          progress={Math.min(totalCalories / calorieGoal, 1)}
          width={null}
          height={12}
          color="#FF7043"
          borderRadius={6}
        />

        <Text style={styles.progressLabel}>
          Protein: {totalProtein} / {proteinGoal} g
        </Text>
        <Progress.Bar
          progress={Math.min(totalProtein / proteinGoal, 1)}
          width={null}
          height={12}
          color="#42A5F5"
          borderRadius={6}
        />

        <Text style={styles.progressLabel}>
          Carbs: {totalCarbs} / {carbsGoal} g
        </Text>
        <Progress.Bar
          progress={Math.min(totalCarbs / carbsGoal, 1)}
          width={null}
          height={12}
          color="#66BB6A"
          borderRadius={6}
        />
      </View>

      {log.length === 0 ? (
        <Text style={styles.empty}>No entries yet. Add some food! 🍽️</Text>
      ) : (
        <FlatList
          data={log}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.entry}>
            {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => onCancel(index)}
              >
                <Text style={styles.cancelText}>X</Text>
              </TouchableOpacity>

              {/* Food Info */}
              <Text style={styles.food}>{item.dish}</Text>

                          <View style={styles.quantityRow}>
  <TouchableOpacity onPress={() => adjustQuantity(index, -1)} style={styles.adjustButton}>
    <Text style={styles.adjustText}>-</Text>
   </TouchableOpacity>

  <Text style={styles.quantityText}>{item.quantity}</Text>

   <TouchableOpacity onPress={() => adjustQuantity(index, 1)} style={styles.adjustButton}>
     <Text style={styles.adjustText}>+</Text>
   </TouchableOpacity>
 </View>
              <Text style={styles.food}>Per Serving contains: {item.perServing}</Text>
              
              
              <Text style={styles.calories}>
  {item.calories * (item.quantity || 1)} kcal
</Text>
<Text style={styles.protein}>
  {(item.protein || 0) * (item.quantity || 1)} g protein
</Text>
<Text style={styles.protein}>
  {(item.carbs || 0) * (item.quantity || 1)} g carbs
</Text>

              
                 <Text style={styles.date}>
                {new Date(item.date).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#dae3e7ff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#000" },

  summaryCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10, color: "#333" },
  progressLabel: { marginTop: 8, fontSize: 14, fontWeight: "500", color: "#444" },

  empty: { fontSize: 16, color: "#555", textAlign: "center", marginTop: 40 },
  entry: {
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "#F1F8E9",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  food: { fontSize: 18, fontWeight: "600" },
  calories: { fontSize: 16, color: "#333" },
  protein: { fontSize: 16, color: "#1E88E5", marginTop: 2 },
  date: { fontSize: 12, color: "#777", marginTop: 4 },

  cancelButton: {
    backgroundColor: "#E53935",
    borderRadius: 30,
    padding: 12, // bigger touch area
    position: "absolute",
    right: 10,
    top: 10,
    elevation: 3,
  },
  cancelText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  // Quantity controls
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  adjustButton: {
    backgroundColor: "#00796b",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  adjustText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  quantityText: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 12,
    color: "#333",
  },
  
  closeButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#060706ff",
    alignItems: "center",
  },
  closeText: { color: "#fff", fontWeight: "bold" },
});
