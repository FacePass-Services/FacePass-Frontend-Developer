"use client";
import React, { useState, useRef, useEffect } from "react";
import SignInForm from "@/components/SignInForm";
import { Button, ModalFooter, ModalHeader } from "@nextui-org/react";
import {
  Image,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import * as faceapi from "face-api.js";
import useToken from "@/hooks/useToken";

const App = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [isFaceLiveness, setIsFaceLiveness] = useState(false);
  const [randomOrientation, setRandomOrientation] = useState<string | null>(null);
  const { setToken } = useToken();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      setLoadingModel(true);

      // Load face-api.js models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector_model-weights_manifest.json"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68_model-weights_manifest.json"),
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models/ssd_mobilenetv1_model-weights_manifest.json"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models/face_recognition_model-weights_manifest.json"),
      ]);

      console.log("Model loaded.");
      setLoadingModel(false);
      detectFace();
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const detectFace = async () => {
    if (videoRef.current) {
      const detections = await faceapi.detectSingleFace(videoRef.current).withFaceLandmarks();
      if (detections) {
        setFaceDetected(true);
      } else {
        setFaceDetected(false);
      }
    }
  };

  // Function to capture a frame from the video and send it to the backend
  const sendFrameToFlask = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Draw the current frame from the video onto a canvas
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Convert canvas content to Blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          const formData = new FormData();
          formData.append("frame", blob);

          try {
            // Send frame to Flask backend
            const response = await axios.post("http://localhost:5000/api1/recognize", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            setToken(response);
            console.log(response.data.token);
            
          } catch (error) {
            console.error("Error sending frame to Flask API:", error);
          }
        }
      });
    }
  };

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play();

      const intervalId = setInterval(async () => {
        detectFace();

        // If face is detected, capture the frame and send it to Flask for recognition
        if (faceDetected) {
          await sendFrameToFlask();
        }
      }, 2000); // Capture frame every 2 seconds

      return () => clearInterval(intervalId);
    }
  }, [videoStream, faceDetected]);

  return (
    <>
      <section className="VStack h-full text-center items-center pt-12 md:pt-0 w-10/12  lg:w-10/12 md:w-7/12 md:justify-center gap-5 min-h-screen">
        <div className="w-full  VStack items-center gap-3">
          <SignInForm isDeveloperPage={true} />
        </div>
        <hr className=" lg:w-4/12 dark:border-black opacity-75 w-full border-gray-300 my-5" />

        <Button
          onClick={() => {
            onOpen();
            startCamera();
          }}
          className="lg:w-4/12 gap-5 w-full text-white bg-black hover:opacity-75"
        >
          Sign In with<span className="font-medium">FacePass</span>
        </Button>
      </section>

      <Modal className=" w-96 h-96" isOpen={isOpen} closeButton={false}>
        <ModalContent>
          <>
            <ModalHeader>
              <div className="HStack"></div>
              <Button onClick={onClose} className="bg-transparent text-blue-500">
                Cancel
              </Button>
            </ModalHeader>
            <ModalBody className="VStack w-full h-full justify-center gap-5 items-center">
              <div className={`relative hidden w-80 h-80 bg-black transition-all duration-500 ${faceDetected ? "rounded-full border-4 border-blue-500" : "rounded-lg"}`}>
                <video ref={videoRef} className="absolute scale-x-[-1] w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" width={640} height={480}></canvas>
              </div>
              {loadingModel && <p>Loading face detection model...</p>}
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default App;
