
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "dailyLog";

export const saveToLog = async (dish, calories, protein, carbs, perServing) => {
  try {
 
     const entry = { 
      dish, 
      protein, 
      carbs, 
      calories, 
      perServing, 
      quantity: 1,   
      date: new Date().toISOString() 
    };

    const existingLog = await AsyncStorage.getItem(STORAGE_KEY);
    const log = existingLog ? JSON.parse(existingLog) : [];

    log.push(entry);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch (err) {
    console.error("❌ Error in saveToLog:", err);
  }
};

export const getLog = async () => {
  try {
    const existingLog = await AsyncStorage.getItem(STORAGE_KEY);
    return existingLog ? JSON.parse(existingLog) : [];
  } catch (err) {
    console.error("❌ Error in getLog:", err);
    return [];
  }
};

export const updateLog = async (logArray) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logArray));
  } catch (err) {
    console.error("❌ Error in updateLog:", err);
  }
};

