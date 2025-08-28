//components/CameraScreen.js

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as tf from "@tensorflow/tfjs";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";
import { BlurView } from "expo-blur";
import { loadModel } from "../utils/modelLoader";
import dish from "../data/dish.json";
import { saveToLog } from "../utils/storage";
import { getModel } from "../utils/modelSingleton";

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

export default function CameraScreen({ onClose }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [model, setModel] = useState(null);
  const [dishInfo, setDishInfo] = useState(null);

  const cameraRef = useRef(null);

  // Ask for camera permission
  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, [permission]);

  // Load model
useEffect(() => {
  (async () => {
    const loadedModel = await getModel();
    setModel(loadedModel);
    setIsModelReady(true);
    console.log("Model loaded in CameraScreen");
  })();
}, []);


  const takePicture = async () => {
    if (!cameraRef.current) return;
    const pic = await cameraRef.current.takePictureAsync({ base64: true });
    setPhoto(pic);
    setPrediction(null);
  };

  const processPhoto = async () => {
    if (!photo || !model) return;
    setIsProcessing(true);

    try {
      const imgB64 = await FileSystem.readAsStringAsync(photo.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      
      const uIntArray = Uint8Array.from(atob(imgB64), (c) => c.charCodeAt(0));
      const imageTensor = decodeJpeg(uIntArray);

      let tensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
      tensor = tensor.expandDims(0).toFloat().div(255.0);

      const outputs = model.predict(tensor);
      const predictions = await outputs.array();

      const topIdx = predictions[0].indexOf(Math.max(...predictions[0]));
      const topClass = classNames[topIdx];
      const confidence = (predictions[0][topIdx] * 100).toFixed(2);

      setPrediction({ class: topClass, confidence });
      setDishInfo(dish[topIdx]);

    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Camera permission is required</Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={[styles.captureButton, { marginTop: 20 }]}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {!photo ? (
        <CameraView style={{ flex: 1 }} ref={cameraRef} facing="back" />
      ) : (
        <Image source={{ uri: photo.uri }} style={{ flex: 1 }} />
      )}

      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Text style={styles.backText}>⬅ Back</Text>
      </TouchableOpacity>

      {/* Bottom Controls with Blur */}
      <BlurView intensity={70} tint="dark" style={styles.bottomBar}>
        {!photo ? (
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            disabled={!isModelReady}
          >
            {isModelReady ? (
              <Text style={styles.buttonText}>📸 Capture</Text>
            ) : (
              <ActivityIndicator color="#fff" />
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.captureButton, { backgroundColor: "#E53935" }]}
              onPress={() => {
                setPhoto(null);
                setPrediction(null);
              }}
            >
              <Text style={styles.buttonText}>🔄 Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, { backgroundColor: "#4CAF50" }]}
              onPress={processPhoto}
              disabled={isProcessing}
            >
              <Text style={styles.buttonText}>
                {isProcessing ? "⏳ Processing..." : "✅ Use Photo"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Prediction result */}
        {prediction && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              🍴 {prediction.class} ({prediction.confidence}%)
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

<TouchableOpacity
      style={styles.logBtn}
      onPress={async () => {
        try {
          await saveToLog(
            prediction.class,
            dishInfo.calories,
            dishInfo.carbs,
            dishInfo.protein,
            dishInfo.perServing
          );
          alert("Added to daily log ✅");
        } catch (err) {
          console.error("Error saving to log:", err);
        }
      }}
    >
      <Text style={styles.logBtnText}>➕ Add to Daily Log</Text>
    </TouchableOpacity>


          </View>
        )}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    minWidth: 130,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
 
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  resultBox: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
