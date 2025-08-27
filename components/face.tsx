import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { BACKEND_URL } from "@/lib/config";

const FaceLogin = () => {
  const [userRecognized, setUserRecognized] = useState(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadModels = async () => {
      console.log("Frontend: Loading face API models...");
      await faceapi.nets.tinyFaceDetector.loadFromUri(
        "/models/tiny_face_detector_model-weights_manifest.json"
      );
      await faceapi.nets.faceLandmark68Net.loadFromUri(
        "/models/face_landmark_68_model-weights_manifest.json"
      );
      await faceapi.nets.faceRecognitionNet.loadFromUri(
        "/models/face_recognition_model-weights_manifest.json"
      );
      console.log("Frontend: Models loaded successfully.");
    };

    const startVideo = async () => {
      console.log("Frontend: Starting video stream...");
      await loadModels();

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };

    startVideo();

    if (videoRef.current) {
      videoRef.current.addEventListener("play", () => {
        const intervalId = setInterval(async () => {
          const videoEl = videoRef.current;
          if (!videoEl) return;

          const detections = await faceapi
            .detectAllFaces(videoEl, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

          if (detections.length > 0) {
            const faceDescriptors = detections.map((d) => d.descriptor);
            recognizeFace(faceDescriptors);
          }
        }, 500);

        // Cleanup on unmount
        return () => clearInterval(intervalId);
      });
    }
  }, []); 


const recognizeFace = async (faceDescriptors: Float32Array[]) => {
    const descriptors = faceDescriptors.map((desc) => Array.from(desc)); // Convert Float32Array to a regular array
    const response = await fetch(`${BACKEND_URL}/api1/recognize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ faceDescriptors: descriptors }),
    });
    const result = await response.json();
    if (result.success) {
      setUserRecognized(result.user);
    } else {
      console.log("Face not recognized");
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted width="720" height="560"></video>
      {userRecognized && <p>Welcome, {userRecognized}!</p>}
    </div>
  );
};

export default FaceLogin;
