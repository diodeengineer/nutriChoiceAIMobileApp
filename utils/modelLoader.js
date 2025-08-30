
// utils/modelLoader.js

import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // GPU accelerated backend
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

let model = null;

export async function loadModel() {
  if (!model) {
    await tf.ready();
    model = await tf.loadGraphModel(
      bundleResourceIO(
        require("../assets/tfjs_model/model.json"),
        [
          require("../assets/tfjs_model/group1-shard1of10.bin"),
          require("../assets/tfjs_model/group1-shard2of10.bin"),
          require("../assets/tfjs_model/group1-shard3of10.bin"),
          require("../assets/tfjs_model/group1-shard4of10.bin"),
          require("../assets/tfjs_model/group1-shard5of10.bin"),
          require("../assets/tfjs_model/group1-shard6of10.bin"),
          require("../assets/tfjs_model/group1-shard7of10.bin"),
          require("../assets/tfjs_model/group1-shard8of10.bin"),
          require("../assets/tfjs_model/group1-shard9of10.bin"),
          require("../assets/tfjs_model/group1-shard10of10.bin"),
        ]
      )
    );
    console.log("✅ Model loaded");
  }
  return model;
}
