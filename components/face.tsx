import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { BACKEND_URL } from "@/lib/config";

const FaceLogin = () => {
  const videoRef = useRef(null);
  const [userRecognized, setUserRecognized] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      console.log("Frontend: Loading face API models...");
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector_model-weights_manifest.json");
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68_model-weights_manifest.json');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models/face_recognition_model-weights_manifest.json');
      console.log("Frontend: Models loaded successfully.");
    };

    const startVideo = async () => {
      console.log("Frontend: Starting video stream...");
      await loadModels();
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        videoRef.current.srcObject = stream;
      });
    };

    startVideo();

    videoRef.current.addEventListener('play', () => {
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                                        .withFaceLandmarks()
                                        .withFaceDescriptors();
        if (detections.length > 0) {
          const faceDescriptors = detections.map(d => d.descriptor);
          recognizeFace(faceDescriptors);
        }
      }, 500);  // Adjust the interval for better performance
    });
    
  }, []);
  const recognizeFace = async (faceDescriptors) => {
    const descriptors = faceDescriptors.map((desc) => Array.from(desc)); // Convert Float32Array to a regular array
    const response = await fetch(`${BACKEND_URL}/api1/recognize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faceDescriptors: descriptors })
    });
    const result = await response.json();
    if (result.success) {
      setUserRecognized(result.user);
    } else {
      console.log('Face not recognized');
    }
  };
  
  
  return (
    <div>
      <video ref={videoRef} autoPlay muted width="720" height="560"></video>
      {userRecognized && <p>Welcome, {userRecognized.email}!</p>}
    </div>
  );
};

export default FaceLogin;
