
// utils/imageUtils.js
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // GPU accelerated backend

import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";

export async function imageToTensor(uri) {
  // Read file as base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Convert base64 to Uint8Array
  const uInt8Array = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

  // Decode JPEG forcing 3 channels
  let imageTensor = decodeJpeg(uInt8Array, 3);

  console.log("Original tensor shape:", imageTensor.shape); // [H,W,3]

  // Resize to model input (replace 224 with your trained size)
  imageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);

  // Normalize and add batch dimension
  imageTensor = imageTensor.expandDims(0).toFloat().div(255.0);

  console.log("Tensor ready for model:", imageTensor.shape); // [1,224,224,3]

  return imageTensor;
}
