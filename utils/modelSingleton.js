// utils/modelSingleton.js
import * as tf from "@tensorflow/tfjs";
import { loadModel } from "./modelLoader";

let cachedModel = null;

export async function getModel() {
  if (!cachedModel) {
    await tf.ready();
    cachedModel = await loadModel();

    // Warmup: run one dummy predict to compile shaders
    const warmup = tf.zeros([1, 224, 224, 3]);
    cachedModel.predict(warmup).dispose();

    console.log("✅ Model loaded & warmed up (singleton)");
  }
  return cachedModel;
}
