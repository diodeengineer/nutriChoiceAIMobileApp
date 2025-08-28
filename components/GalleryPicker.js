//components/GalleryPicker.js

import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { imageToTensor } from "../utils/imageUtils";
import dish from "../data/dish.json";
import { saveToLog } from "../utils/storage";
import { getModel } from "../utils/modelSingleton";  


// Map class indices to your dishes
const classNames = [
  "momos",
  "omelette",
  "paratha",
  "ras_malai",
  "rasgulla",
  "samosa",
  "tomato_chutney",
  "uttapam",
  "vada_pav",
];

export default function GalleryPicker({ onClose }) {
  const [imageUri, setImageUri] = useState(null);
  const [predictedDish, setPredictedDish] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dishInfo, setDishInfo] = useState(null);
   const [model, setModel] = useState(null);
  const [isModelReady, setIsModelReady] = useState(false);



useEffect(() => {
  (async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission required!");
    }
  })();

  // load model once via singleton
  (async () => {
    setLoading(true); // show spinner while loading model
    const loadedModel = await getModel();
    setModel(loadedModel);
    setIsModelReady(true);
    setLoading(false);
    console.log("Model loaded in GalleryPicker");
  })();
}, []);

const pickImage = async () => {
  if (!isModelReady) {
    alert("⏳ Model is still loading. Please wait...!");
    return;
  }

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      runPrediction(uri);
    }
  } catch (err) {
    console.error("Error picking image:", err);
  }
};

const runPrediction = async (uri) => {
  try {
    setLoading(true);
    setPredictedDish(null);
    setConfidence(null);

    const tensor = await imageToTensor(uri);

    console.log("Tensor shape before predict:", tensor.shape);

    const prediction = model.predict(tensor);
    const probs = await prediction.data();

    const classIndex = probs.indexOf(Math.max(...probs));
    setPredictedDish(classNames[classIndex]);
    setConfidence((probs[classIndex] * 100).toFixed(1)); // store string with %
    setDishInfo(dish[classIndex]);

    console.log("Predictions:", probs);
    console.log("Predicted:", classNames[classIndex]);
  } catch (err) {
    console.error("Prediction error:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      {onClose && (
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
        <Text style={styles.pickBtnText}>📂 Pick Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      {loading && (
        <ActivityIndicator size="large" color="#FF6B6B" style={{ margin: 20 }} />
      )}

 {predictedDish && (
  <View style={styles.resultCard}>
    <Text style={styles.resultText}>
     Dish: <Text style={{ fontWeight: "bold" }}>{predictedDish}</Text>
    </Text>
    <Text style={styles.confText}>
  Confidence: {confidence}%
</Text>


    {dishInfo && (
      <View style={{ marginTop: 15 }}>
        <Text style={styles.nutriText}>Nutrition per {dishInfo.perServing}</Text>
        <Text style={styles.nutriText}>Calories: {dishInfo.calories} kcal</Text>
        <Text style={styles.nutriText}>Protein: {dishInfo.protein} gm</Text>
        <Text style={styles.nutriText}>Carbs: {dishInfo.carbs} gm</Text>
        <Text style={styles.nutriText}>Fat: {dishInfo.fat} gm</Text>
      </View>
    )}

    {/*Add to Log Button */}
    <TouchableOpacity
      style={styles.logBtn}
     onPress={async () => {
  try {
    console.log("Add to log pressed");
    await saveToLog(
  predictedDish,
  dishInfo.calories,
  dishInfo.protein,
  dishInfo.carbs,
  dishInfo.fat,
  dishInfo.perServing
);
  alert("✅ Added to daily log");
  } catch (err) {
    console.error("Error saving to log:", err);
  }
}}
    >
      <Text style={styles.logBtnText}>➕ Add to Daily Log</Text>
    </TouchableOpacity>
  </View>
)}
    </View>
  );}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    elevation: 5,
  },
  backText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  pickBtn: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 15,
    elevation: 3,
  },
  pickBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  resultCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
    marginTop: 20,
    width: "85%",
  },
  resultText: {
    fontSize: 20,
    marginBottom: 10,
    color: "#111827",
  },
  confText: {
    fontSize: 16,
    color: "#6B7280",
  },

  nutriText: {
    fontSize: 14,
    color: "#374151",
    marginTop: 3,
  },
  

logBtn: {
  backgroundColor: "#2563EB",
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 10,
  marginTop: 15,
  elevation: 3,
},
logBtnText: {
  color: "white",
  fontSize: 15,
  fontWeight: "600",
},

});
