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
import { BACKEND_URL } from "@/lib/config";


const App = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [isFaceLiveness, setIsFaceLiveness] = useState(false);
  const [randomOrientation, setRandomOrientation] = useState<string | null>(null);
  const [findingFaceStartTime, setFindingFaceStartTime] = useState<number | null>(null);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [orientation, setOrientation] = useState("");
  const [recFaceLeft, setRecFaceLeft] = useState(false);
  const [recFaceRight, setRecFaceRight] = useState(false);
  const [findingFace, setFindingFace] = useState(false);
  const { setToken } = useToken();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      setLoadingModel(true);

      // Load face-api.js models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(
          "/models/tiny_face_detector_model-weights_manifest.json"
        ),
        faceapi.nets.faceLandmark68Net.loadFromUri(
          "/models/face_landmark_68_model-weights_manifest.json"
        ),
        faceapi.nets.ssdMobilenetv1.loadFromUri(
          "/models/ssd_mobilenetv1_model-weights_manifest.json"
        ),
        faceapi.nets.faceRecognitionNet.loadFromUri(
          "/models/face_recognition_model-weights_manifest.json"
        ),
      ]);

      console.log("Model loaded.");
      setLoadingModel(false);
      detectFace();
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  // Function to capture a frame from the video and send it to the backend
  const sendFrameToFlask = async () => {
    if (!videoRef.current || !canvasRef.current) return;

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
            const response = await axios.post(
              `${BACKEND_URL}/api1/recognize`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );

            setToken(response.data);
            window.location.href = "/";
          } catch (error) {
            console.error("Error sending frame to Flask API:", error);
          }
        }
      });
    }
  };

  const generateRandomOrientation = () => {
    const orientations = ["left", "right"];
    const randomIndex = Math.floor(Math.random() * orientations.length);
    const newOrientation = orientations[randomIndex];
    
    console.log("Selected Orientation:", newOrientation);
    setRandomOrientation(newOrientation);
  };
  
  const isNotNull = (value: string | null): value is string => value !== null;

  const faceLiveness = (detectedOrientation: string) => {
    console.log("Detected Orientation:", detectedOrientation);
    console.log("Expected Orientation:", randomOrientation);

    if (isNotNull(randomOrientation) && detectedOrientation.toLowerCase() === randomOrientation.toLowerCase()) {
      console.log("Liveness Check Passed:", detectedOrientation);
      setIsFaceLiveness(true); 
      return true;
    } else {
      console.log("Liveness Check Failed:", detectedOrientation);
      return false;
    }
  };

  const detectFace = async () => {
    if (videoRef.current) {
      const detections = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks();
  
      if (detections) {
        setFaceDetected(true);
        const { landmarks } = detections;
        const nose = landmarks.getNose();
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
  
        if (nose && leftEye && rightEye) {
          const nosePosition = { x: nose[3].x, y: nose[3].y };
          const leftEyePosition = { x: leftEye[0].x, y: leftEye[1].y };
          const rightEyePosition = { x: rightEye[3].x, y: rightEye[1].y };
  
          const distance = (
            p1: { x: number; y: number },
            p2: { x: number; y: number }
          ) => Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  
          const distLeftEyeToNose = distance(leftEyePosition, nosePosition);
          const distRightEyeToNose = distance(rightEyePosition, nosePosition);
          const distLeftEyeToRightEye = distance(
            leftEyePosition,
            rightEyePosition
          );
  
          const triangleArea = (a: number, b: number, c: number) => {
            const s = (a + b + c) / 2;
            return Math.sqrt(s * (s - a) * (s - b) * (s - c));
          };
  
          const area = triangleArea(
            distLeftEyeToNose,
            distRightEyeToNose,
            distLeftEyeToRightEye
          );
  
          let detectedOrientation: string | undefined;
  
          const eyeThreshold = 0.15 * distLeftEyeToRightEye;
          const areaThreshold = 0.2 * distLeftEyeToRightEye;
  
          if (distLeftEyeToNose > distRightEyeToNose + eyeThreshold) {
            detectedOrientation = "left";
            if (!recFaceLeft) {
              setRecFaceLeft(true);
            } else {
              setRecFaceLeft(false);
            }
          } else if (distRightEyeToNose > distLeftEyeToNose + eyeThreshold) {
            detectedOrientation = "right";
            if (!recFaceRight) {
              setRecFaceRight(true);
            } else {
              setRecFaceRight(false);
            }
          }
  
          // Call the faceLiveness function here to compare detected orientation with random orientation
          if (detectedOrientation) {
            const result = faceLiveness(detectedOrientation);
            setIsFaceLiveness(faceLiveness(detectedOrientation))
        
          
          }
        }
      }
    }
  };
  
  // Random Faceliveness
  useEffect(() => {
    if (randomOrientation === null) {
      generateRandomOrientation();
    }
  }, [randomOrientation]);
  
  
  // Face Detection Timer
  useEffect(() => {
    let intervalId: any = null;
    let count = 0;

    if (findingFace && !faceDetected && findingFaceStartTime === null) {
      setFindingFaceStartTime(Date.now());
    }
  

    if (findingFace && !faceDetected && findingFaceStartTime === null) {
      intervalId = setInterval(() => {
        count++;
        console.log(count);

        if (count >= 7) {
          setShowTryAgain(true);
          stopCamera();
          clearInterval(intervalId);
        }
      }, 1000);
    }

    if (faceDetected && !findingFace) {
      clearInterval(intervalId);
      count = 0;
      setShowTryAgain(false);
    }

    return () => clearInterval(intervalId);
  }, [faceDetected, findingFaceStartTime, findingFace]);


  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
  };
  //Canecl Button
  const resetState = () => {
    setCameraOpen(false);
    setVideoStream(null);
    setFaceDetected(false);
    setLoadingModel(false);
    setIsFaceLiveness(false);
    setRandomOrientation(null);
    setFindingFace(false);
    stopCamera();
    setShowTryAgain(false);
  };

  //Sign In Func
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play();
      setCameraOpen(true);
      const intervalId = setInterval(async () => {
        setCameraOpen(false);

        setFindingFace(true);

        detectFace();


        if (isFaceLiveness) {
          sendFrameToFlask();
        }
        
      }, 3000); // Capture frame every 2 seconds

      return () => clearInterval(intervalId);
    }
  }, [isFaceLiveness,videoStream, faceDetected]);

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
              <Button
                onClick={() => {
                  onClose();
                  resetState();
                }}
                className="bg-transparent text-blue-500"
              >
                Cancel
              </Button>
            </ModalHeader>
            <ModalBody className="VStack w-full h-full justify-center gap-5 items-center">
              <div
                className={`relative hidden w-80 h-80 bg-black transition-all duration-500 ${
                  faceDetected
                    ? "rounded-full border-4 border-blue-500"
                    : "rounded-lg"
                }`}
              >
                <video
                  ref={videoRef}
                  className="absolute scale-x-[-1] w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                  width={640}
                  height={480}
                ></canvas>
              </div>
              {/* {faceDetected ? (
                <>
                  <Image
                    src={
                      isFaceLiveness
                        ? "images/done-animate.gif"
                        : "images/face-detected.gif"
                    }
                    className={`w-32  h-32  object-cover rounded-full transition duration-500 ${
                      faceDetected ? "opacity-100" : "opacity-0"
                    }`}
                    alt=""
                  />
                </>
              ) : (
                <>
                  <Image
                    src="images/light-face-find.gif"
                    className={`w-48  h-48  object-cover rounded-full transition duration-500 `}
                    alt=""
                  />
                </>
              )} */}
              {faceDetected ? (
                <>
                  <Image
                    src={
                      isFaceLiveness
                        ? "images/done-animate.gif"
                        : "images/face-detected.gif"
                    }
                    className={`w-32  h-32  object-cover rounded-full transition duration-500 ${
                      faceDetected ? "opacity-100" : "opacity-0"
                    }`}
                    alt=""
                  />
                </>
              ) : !showTryAgain ? (
                <>
                  <Image
                    src="images/light-face-find.gif"
                    className={`w-48  h-48  object-cover rounded-full transition duration-500 `}
                    alt=""
                  />
                </>
              ) : (
                <>
                  <Image
                    src="images/fail.png"
                    className={`w-48  h-48  object-cover rounded-full transition duration-500 `}
                    alt=""
                  />
                </>
              )}
              {loadingModel && !findingFace && (
                <p>Loading face detection model</p>
              )}
              {!loadingModel && cameraOpen && !findingFace && (
                <p>Opening camera</p>
              )}
              {findingFace && !faceDetected && !showTryAgain && (
                <>
                  {" "}
                  <p>Finding face...</p>
                </>
              )}
              {findingFace && faceDetected && (
                <>
                  <p>
                    {orientation === "Correct"
                      ? "CORRECT"
                      : `TURN ${
                          randomOrientation?.charAt(0).toUpperCase() +
                          randomOrientation?.slice(1).toUpperCase()
                        }`}
                  </p>
                </>
              )}
              {showTryAgain && <p>Try again</p>}
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default App;
