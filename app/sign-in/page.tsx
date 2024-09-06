// App.tsx
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
const App = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [findingFace, setFindingFace] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      setLoadingModel(true);

      // Load face-api.js models
      try {
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
      } catch (error) {
        console.error("Error loading face detection models:", error);
      }
      console.log("Model loaded.");

      setLoadingModel(false);
      setFindingFace(true);

      // Start face detection
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
        setFindingFace(false);
        const { landmarks } = detections;
        const nose = landmarks.getNose();
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();

        if (nose && leftEye && rightEye) {
          const nosePosition = { x: nose[3].x, y: nose[3].y };
          const leftEyePosition = { x: leftEye[0].x, y: leftEye[1].y };
          const rightEyePosition = { x: rightEye[3].x, y: rightEye[1].y };

          const distance = (p1: any, p2: any) =>
            Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);

          const distLeftEyeToNose = distance(leftEyePosition, nosePosition);
          const distRightEyeToNose = distance(rightEyePosition, nosePosition);
          const distLeftEyeToRightEye = distance(
            leftEyePosition,
            rightEyePosition
          );

          const triangleArea = (a: any, b: any, c: any) => {
            const s = (a + b + c) / 2;
            return Math.sqrt(s * (s - a) * (s - b) * (s - c));
          };

          const area = triangleArea(
            distLeftEyeToNose,
            distRightEyeToNose,
            distLeftEyeToRightEye
          );

          let orientation;

          const eyeThreshold = 0.15 * distLeftEyeToRightEye;
          const areaThreshold = 0.2 * distLeftEyeToRightEye;

          if (distLeftEyeToNose > distRightEyeToNose + eyeThreshold) {
            orientation = "left";
          } else if (distRightEyeToNose > distLeftEyeToNose + eyeThreshold) {
            orientation = "right";
          } else if (area < 2000 * areaThreshold && nosePosition.y < 230) {
            orientation = "up";
          } else if (area > 3000 * areaThreshold || nosePosition.y > 300) {
            orientation = "down";
          } else {
            orientation = "center";
          }
          console.log("Current: ", orientation);

          return { orientation }; // Return an object with the orientation property
        } else {
          console.error("Landmarks data is missing");
          return { orientation: null }; // Return an object with a null orientation property
        }
      } else {
        setFaceDetected(false);
        console.log("No face detected");
        return { orientation: null }; // Return an object with a null orientation property
      }
    }
  };
  const [isFaceLiveness, setIsFaceLiveness] = useState(false);

  const [randomOrientation, setRandomOrientation] = useState<string | null>(
    null
  );
  // const faceLiveness = async () => {
  //   if (randomOrientation === null) {
  //     const orientations = ["left", "right"];
  //     const newRandomOrientation =
  //       orientations[Math.floor(Math.random() * orientations.length)];
  //     setRandomOrientation(newRandomOrientation);
  //   }

  //   const faceDetectionResult = await detectFace();
  //   if (!faceDetectionResult) {
  //     console.log("Face detection result is undefined");
  //     return false; // or throw an error, depending on your requirements
  //   }

  //   if (faceDetectionResult.orientation === randomOrientation) {
  //     console.log("Face liveness check passed!");
  //     return true;
  //   } else {
  //     console.log("Face liveness check failed!");
  //     return false;
  //   }
  // };
  const faceLiveness = async () => {
    let newRandomOrientation: string | null = randomOrientation;

    if (newRandomOrientation === null) {
      const orientations = ["left", "right"];
      newRandomOrientation =
        orientations[Math.floor(Math.random() * orientations.length)];
    }
    console.log("Liveness: ", newRandomOrientation);

    const faceDetectionResult = await detectFace();
    if (!faceDetectionResult) {
      console.log("Face detection result is undefined");
      return false; // or throw an error, depending on your requirements
    }

    if (faceDetectionResult.orientation === newRandomOrientation) {
      console.log("Face liveness check passed!");
      setRandomOrientation(newRandomOrientation); // Update randomOrientation only when the check passes
      return true;
    } else {
      console.log("Face liveness check failed!");
      return false;
    }
  };
  // useEffect(() => {
  //   if (videoRef.current && videoStream) {
  //     videoRef.current.srcObject = videoStream;
  //     videoRef.current.play();

  //     // Check face every 1 second
  //     const intervalId = setInterval(() => {
  //       detectFace();
  //     }, 1000);

  //     return () => clearInterval(intervalId);
  //   }
  // }, [videoStream]);
  // useEffect(() => {
  //   if (videoRef.current && videoStream) {
  //     videoRef.current.srcObject = videoStream;
  //     videoRef.current.play();

  //     // Initialize the timer to 7 seconds
  //     let timer = 7;

  //     // Check face every 1 second
  //     const intervalId = setInterval(() => {
  //       // Decrease the timer by 1
  //       timer--;

  //       console.log(`Timer: ${timer}`); // Log the timer value

  //       // If the timer has reached 0 and no face is detected, set timerExpired to true
  //       if (timer === 0 && !faceDetected) {
  //         setTimerExpired(true);
  //         clearInterval(intervalId); // Stop the interval when timer expires
  //       }

  //       // If face is detected, reset the timer
  //       if (faceDetected) {
  //         timer = 7;
  //         setTimerExpired(false);
  //         faceLiveness().then((result) => {
  //           if (result) {
  //             console.log("Correct");
  //           } else {
  //             console.log("Not yet");
  //           }
  //         });
  //       }

  //       // Call detectFace function only if timer has not expired
  //       if (!timerExpired) {
  //         detectFace();
  //       }
  //     }, 1000);

  //     return () => clearInterval(intervalId);
  //   }
  // }, [videoStream, faceDetected, timerExpired, faceLiveness]);
  // useEffect(() => {
  //   if (videoRef.current && videoStream) {
  //     videoRef.current.srcObject = videoStream;
  //     videoRef.current.play();

  //     // Initialize the timer to 7 seconds
  //     let timer = 7;

  //     // Check face every 1 second
  //     const intervalId = setInterval(() => {
  //       // Decrease the timer by 1
  //       timer--;

  //       console.log(`Timer: ${timer}`); // Log the timer value

  //       // If the timer has reached 0 and no face is detected, set timerExpired to true
  //       if (timer === 0 && !faceDetected) {
  //         setTimerExpired(true);
  //         clearInterval(intervalId); // Stop the interval when timer expires
  //       }

  //       // If face is detected, reset the timer
  //       if (faceDetected) {
  //         timer = 7;
  //         setTimerExpired(false);
  //         const faceLiveness = async () => {
  //           // Generate a random face orientation
  //           const orientations = ["left", "right"];
  //           const randomOrientation =
  //             orientations[Math.floor(Math.random() * orientations.length)];

  //           // Get the current face detection result
  //           const faceDetectionResult = await detectFace();

  //           // Check if the face detection result matches the generated orientation
  //           if (faceDetectionResult.orientation === randomOrientation) {
  //             console.log("Face liveness check passed!");
  //             return true;
  //           } else {
  //             console.log("Face liveness check failed!");
  //             return false;
  //           }
  //         };
  //         faceLiveness().then((result) => {
  //           if (result) {
  //             console.log("Correct");
  //           } else {
  //             console.log("Not yet");
  //           }
  //         });
  //       }

  //       // Call detectFace function only if timer has not expired
  //       if (!timerExpired) {
  //         detectFace();
  //       }
  //     }, 1000);

  //     return () => clearInterval(intervalId);
  //   }
  // }, [videoStream, faceDetected, timerExpired]);
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play();

      const intervalId = setInterval(async () => {
        if (faceDetected && !isFaceLiveness) {
          const result = await faceLiveness();
          if (result) {
            console.log("Face liveness check passed!");
            setIsFaceLiveness(true); // Set faceLivenessPassed to true
            // Update the state or trigger an action here
            // For example, you can set a state variable to true
            // setFaceLivenessPassed(true);
          } else {
            console.log("Face liveness check failed!");
            // Update the state or trigger an action here
            // For example, you can set a state variable to false
            // setFaceLivenessPassed(false);
          }
        }

        detectFace();
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [videoStream, faceDetected, isFaceLiveness]);
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
                onClick={onClose}
                className="  bg-transparent text-blue-500"
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
                  hidden // Add this attribute
                />
              </div>
              {randomOrientation && (
                <>
                  {" "}
                  <p className="text-2xl font-medium">
                    Turn {randomOrientation}
                  </p>
                </>
              )}
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
                <>
                  <Image
                    src="images/light-face-find.gif"
                    className={`w-48  h-48  object-cover rounded-full transition duration-500 ${
                      timerExpired ? "opacity-10" : "opacity-100"
                    }`}
                    alt=""
                  />
                </>
              )}
              {loadingModel && <p>Loading face detection model...</p>}

              {findingFace ? (
                <>
                  {" "}
                  <p>Finding face...</p>
                </>
              ) : (
                <>
                  <p></p>
                </>
              )}
              {/* <p className="text-black dark:text-white font-medium text-3xl">
                FacePass
              </p> */}
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default App;
