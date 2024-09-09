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
import { count } from "console";

const App = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [isFaceLiveness, setIsFaceLiveness] = useState(false);
  const [randomOrientation, setRandomOrientation] = useState<string | null>(
    null
  );
  const [findingFaceStartTime, setFindingFaceStartTime] = useState<number | null>(null);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [orientation, setOrientation] = useState("");

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

  const detectFace = async () => {
    if (videoRef.current) {
      const detections = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks();
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
            console.log(response.data);
            setToken(response.data);
            window.location.href = "/";
          } catch (error) {
            console.error("Error sending frame to Flask API:", error);
          }
        }
      });
    }
  };
  useEffect(() => {
    if (findingFace && !faceDetected && findingFaceStartTime === null) {
      setFindingFaceStartTime(Date.now());
    }
  
    if (findingFace && !faceDetected && findingFaceStartTime !== null) {
      // const elapsedTime = Date.now() - findingFaceStartTime;
      // console.log(elapsedTime);
      // console.log(`Elapsed time: ${elapsedTime/1000} seconds`); 
      let count = 0; // Initialize count
      let intervalId: any = null
      intervalId = setInterval(() => {
        count++;
        console.log(count);

        if (count >= 7) {
          clearInterval(intervalId);
          setShowTryAgain(true); 
          stopCamera()
        }

        while (faceDetected ) {
          // setFindingFaceStartTime(null);
          setShowTryAgain(false);
          count = 0;
        }
      }, 1000);
      // }
      // if (elapsedTime >= 5) {
      //   setShowTryAgain(true);
      // }
    }
  

  
  }, [findingFace, faceDetected, findingFaceStartTime]);
  

  useEffect(() => {
    if (findingFace && faceDetected && !randomOrientation) {
      const randomOrientation = Math.random() < 0.5 ? "left" : "right";
      setRandomOrientation(randomOrientation);
    }
  }, [findingFace, faceDetected, randomOrientation]);
  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
  };
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
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play();
      setCameraOpen(true);
      const intervalId = setInterval(async () => {
        setCameraOpen(false);

        setFindingFace(true);

        detectFace();

        // if (faceDetected) {
        //   await sendFrameToFlask();
        // }
      }, 3000); // Capture frame every 2 seconds

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
) : (
  !showTryAgain ? (
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
  )
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
                  {" "}
                  <p>
                    Turn{" "}
                    {randomOrientation &&
                      randomOrientation.charAt(0).toUpperCase() +
                        randomOrientation.slice(1)}
                  </p>
                </>
              )}{" "}
              {showTryAgain && (<p>Try again</p>)}
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default App;
