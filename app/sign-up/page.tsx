"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";

import {
  Image,
  Input,
  Button,
  DatePicker,
  DateValue,
  RadioGroup,
  Radio,
  useDisclosure,
  Modal,
  ModalContent,
  ModalBody,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { BACKEND_URL } from "@/lib/config";

export default function App() {
  
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState<DateValue | null>(null);
  const [formattedBirthDate, setFormattedBirthDate] = useState<string | null>(
    null
  );
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isFaceSign, setIsFaceSign] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  
  const [faceOrientation, setFaceOrientation] = useState<string | null>(null);

  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isGetStarted, setIsGetStarted] = useState(false);
  const [faceEmbeddings, setFaceEmbeddings] = useState<any[]>([]); // Declare faceEmbeddings state

  const [faceUp, setFaceUp] = useState(false);
  const [faceDown, setFaceDown] = useState(false);
  const [faceLeft, setFaceLeft] = useState(false);
  const [faceRight, setFaceRight] = useState(false);
  const [faceCenter, setFaceCenter] = useState(false);

  const [RecfaceUp, setRecFaceUp] = useState(false);
  const [RecfaceDown, setRecFaceDown] = useState(false);
  const [RecfaceLeft, setRecFaceLeft] = useState(false);
  const [RecfaceRight, setRecFaceRight] = useState(false);
  const [RecfaceCenter, setRecFaceCenter] = useState(false);

  // Initialize states with `number[] | null` to allow both types
  const [faceIDCenter, setFaceIDCenter] = useState<number[] | null>(null);
  const [faceIDRight, setFaceIDRight] = useState<number[] | null>(null);
  const [faceIDLeft, setFaceIDLeft] = useState<number[] | null>(null);
  const [faceIDUp, setFaceIDUp] = useState<number[] | null>(null);
  const [faceIDDown, setFaceIDDown] = useState<number[] | null>(null);
  const getBorderClass = () => {
    const borderClasses = [];
    if (faceUp) borderClasses.push("border-t-8 border-solid border-blue-500");
    if (faceDown) borderClasses.push("border-b-8 border-solid border-blue-500");
    if (faceLeft) borderClasses.push("border-r-8 border-solid border-blue-500");
    if (faceRight)
      borderClasses.push("border-l-8 border-solid border-blue-500");
    return borderClasses.join(" ");
  };
  const isButtonDisabled = !(faceUp && faceDown && faceLeft && faceRight && faceCenter);

  const formatDate = (date: any) => moment(date).format("MM/DD/YYYY");

  const getBlurClass = () => {
    if (
      RecfaceUp &&
      RecfaceDown &&
      RecfaceLeft &&
      RecfaceRight &&
      RecfaceCenter
    ) {
      return "opacity-25"; // Apply the blur effect
    }
    return "";
  };
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      setIsGetStarted(true);

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
        ), // Ensure the SSD model is loaded
        faceapi.nets.faceRecognitionNet.loadFromUri(
          "/models/face_recognition_model-weights_manifest.json"
        ), // Load faceRecognitionNet model
      ]);

      // Start face detection
      detectFace();
    } catch (error) {
      console.error("Error accessing the camera or loading models:", error);
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
  
          const distance = (p1, p2) =>
            Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  
          const distLeftEyeToNose = distance(leftEyePosition, nosePosition);
          const distRightEyeToNose = distance(rightEyePosition, nosePosition);
          const distLeftEyeToRightEye = distance(leftEyePosition, rightEyePosition);
  
          const triangleArea = (a, b, c) => {
            const s = (a + b + c) / 2;
            return Math.sqrt(s * (s - a) * (s - b) * (s - c));
          };
  
          const area = triangleArea(
            distLeftEyeToNose,
            distRightEyeToNose,
            distLeftEyeToRightEye
          );
  
          let orientation: string;
  
          if (distLeftEyeToNose > distRightEyeToNose + 10) {
            orientation = "left";
            if (!RecfaceLeft) {
              await record_face(orientation);
              setRecFaceLeft(true);
            }
            setFaceLeft(true);
          } else if (distRightEyeToNose > distLeftEyeToNose + 10) {
            orientation = "right";
            if (!RecfaceRight) {
              await record_face(orientation);
              setRecFaceRight(true);
            }
            setFaceRight(true);
          } else if (area < 2000) {
            orientation = "up";
            if (!RecfaceUp) {
              await record_face(orientation);
              setRecFaceUp(true);
            }
            setFaceUp(true);
          } else if (area > 3000) {
            orientation = "down";
            if (!RecfaceDown) {
              await record_face(orientation);
              setRecFaceDown(true);
            }
            setFaceDown(true);
          } else {
            orientation = "center";
            if (!RecfaceCenter) {
              await record_face(orientation);
              setRecFaceCenter(true);
            }
            setFaceCenter(true);
          }
  
          // Check if all orientations are recorded
          if (
            RecfaceUp &&
            RecfaceDown &&
            RecfaceLeft &&
            RecfaceRight &&
            RecfaceCenter
          ) {
            stopCamera(); // Stop the camera
            // No need to reset face IDs
          }
        }
      }
    }
  };
  
  
  const record_face = async (orientation: string) => {
    if (videoRef.current) {
      const detections = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();
  
      if (detections) {
        const descriptor = detections.descriptor;
        console.log(`Face orientation: ${orientation}, Descriptor:`, descriptor);
  
        const faceData = {
          orientation,
          descriptor: Array.from(descriptor)
        };
  
        setFaceEmbeddings(prev => [...prev, faceData]);
      }
    }
  };
  
  const filterFaceEmbeddings = (embeddings: any) => {
    const uniqueEmbeddings = [];
    const seenOrientations = new Set();
  
    for (const entry of embeddings) {
      if (!seenOrientations.has(entry.orientation)) {
        seenOrientations.add(entry.orientation);
        uniqueEmbeddings.push(entry);
      }
    }
  
    return uniqueEmbeddings;
  };
  
  const handleFaceDetection = (embeddings:any) => {
    console.log('Detected face embeddings:', embeddings);
    const filteredEmbeddings = filterFaceEmbeddings(embeddings);
    setFaceEmbeddings(filteredEmbeddings);
  };
  

  useEffect(() => {
    // Log the face orientation whenever it changes
    // console.log("Face Detected:", faceDetected);
    // console.log("Face Up:", faceUp);
    // console.log("Face Down:", faceDown);
    // console.log("Face Left:", faceLeft);
    // console.log("Face Right:", faceRight);
  }, [faceDetected, faceUp, faceDown, faceLeft, faceRight]);



  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
    faceapi.nets.tinyFaceDetector.dispose();
    faceapi.nets.faceLandmark68Net.dispose();
    faceapi.nets.ssdMobilenetv1.dispose();
    faceapi.nets.faceRecognitionNet.dispose();
  };
  

  const checkEmailExists = async (email: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/check_email`, {
        email,
      });
      return response.data.exists;
    } catch (error) {
      console.error("Check email error:", error);
      return false;
    }
  };

  const cancel = () => {
    stopCamera();
    setIsFaceSign(false);
    setIsGetStarted(false);
    setFaceDown(false);
    setFaceUp(false);
    setFaceLeft(false);
    setFaceRight(false);
    setFaceCenter(false);
    setRecFaceCenter(false);
    setRecFaceUp(false);
    setRecFaceDown(false);
    setRecFaceLeft(false);
    setRecFaceRight(false);

    setFaceIDCenter(null);
    setFaceIDDown(null);
    setFaceIDRight(null);
    setFaceIDUp(null);
    setFaceIDLeft(null);
  };

  const prepareFaceEmbeddings = (embedding: any) => {
    const uniqueEmbeddingsMap = new Map();

    embedding.forEach(({ orientation, descriptor }: any) => {
      if (!uniqueEmbeddingsMap.has(orientation)) {
        uniqueEmbeddingsMap.set(orientation, {
          orientation,
          descriptor: Array.from(descriptor)
        });
      }
    });

    return Array.from(uniqueEmbeddingsMap.values());
  };
  
  const signUp = async () => {
    const filteredFaceEmbeddings = prepareFaceEmbeddings(faceEmbeddings);

    console.log('Sending registration data:', {
      first_name: firstName,
      last_name: lastName,
      date_of_birth: formattedBirthDate,
      gender,
      phone_number: phoneNumber,
      email,
      faceEmbeddings: filteredFaceEmbeddings,
    });

    try {
      const response = await axios.post(`${BACKEND_URL}/auth/register`, {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: formattedBirthDate,
        gender,
        phone_number: phoneNumber,
        email,
        faceEmbeddings: filteredFaceEmbeddings,
      });

      console.log("Registration successful!", response.data);
      // onOpen();
      stopCamera();

      setTimeout(() => {
        router.push("/sign-in");
      }, 1500);
    } catch (error) {
      console.error("Sign-up error:", error.response ? error.response.data : error.message);
    }
  };

  
  
  

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Reset error messages
    setFirstNameError("");
    setLastNameError("");
    setBirthDateError("");
    setGenderError("");
    setPhoneNumberError("");
    setEmailError("");
    setErrorMessage("");

    // Validate required fields
    let hasError = false;
    if (!firstName) {
      setFirstNameError("First name is required.");
      hasError = true;
    }
    if (!lastName) {
      setLastNameError("Last name is required.");
      hasError = true;
    }
    if (!birthDate) {
      setBirthDateError("Birth date is required.");
      hasError = true;
    }
    if (!gender) {
      setGenderError("Gender is required.");
      hasError = true;
    }
    if (!phoneNumber) {
      setPhoneNumberError("Phone number is required.");
      hasError = true;
    }
    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const exists = await checkEmailExists(email);
    if (exists) {
      setEmailExists(true);
      setErrorMessage("Email already exists. Please use a different email.");
    } else {
      setEmailExists(false);
      // Switch to the second view by setting isFaceSign to true
      setIsFaceSign(true);
    }
  };

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play();

      const intervalId = setInterval(() => {
        detectFace();
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [videoStream]);
  useEffect(() => {
    console.log("Face embeddings:", faceEmbeddings);
  }, [faceEmbeddings]);
  
  return (
    <>
      {!isFaceSign ? (
        <main className="VStack min-h-screen items-center pb-10 w-10/12">
          <div className="VStack gap-5 items-center pt-10">
            <p className="font-semibold text-3xl">
              Create Your FacePass Account
            </p>
            <p>One FacePass account is all you need to access all services.</p>
            <form onSubmit={handleSubmit} className="VStack gap-5">
              <div className="HStack gap-5">
                <div className="VStack flex w-full flex-wrap md:flex-nowrap gap-4">
                  <Input
                    isRequired
                    variant="bordered"
                    type="text"
                    label="First name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setFirstNameError("");
                    }}
                  />
                  {firstNameError && (
                    <p className="text-red-500 text-sm">{firstNameError}</p>
                  )}
                </div>

                <div className="VStack flex w-full flex-wrap md:flex-nowrap gap-4">
                  <Input
                    isRequired
                    variant="bordered"
                    type="text"
                    label="Last name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setLastNameError("");
                    }}
                  />
                  {lastNameError && (
                    <p className="text-red-500 text-sm">{lastNameError}</p>
                  )}
                </div>
              </div>
              <DatePicker
                isRequired
                variant="bordered"
                label="Birth date"
                value={birthDate}
                onChange={(date) => {
                  setBirthDate(date);
                  setFormattedBirthDate(
                    date !== null ? formatDate(date) : null
                  );
                  setBirthDateError("");
                }}
                className="w-full"
              />
              {birthDateError && (
                <p className="text-red-500 text-sm">{birthDateError}</p>
              )}
              <RadioGroup
                isRequired
                label="Select your gender"
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  setGenderError("");
                }}
                orientation="horizontal"
              >
                <Radio value="male">Male</Radio>
                <Radio value="female">Female</Radio>
              </RadioGroup>
              {genderError && (
                <p className="text-red-500 text-sm">{genderError}</p>
              )}
              <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                <Input
                  isRequired
                  variant="bordered"
                  type="number"
                  label="Phone number"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setPhoneNumberError("");
                  }}
                />
              </div>
              {phoneNumberError && (
                <p className="text-red-500 text-sm">{phoneNumberError}</p>
              )}
              <div className="flex w-full flex-wrap md:flex-nowrap justify-end gap-4">
                <Input
                  isRequired
                  variant="bordered"
                  type="email"
                  label="Email"
                  description="This will be your connected email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                    setErrorMessage("");
                  }}
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              <div className="w-full">
                <p className="text-xs text-center">
                  <span className="opacity-75">
                    Your FacePass account information is used to allow you to
                    sign in securely and access your data. <br /> FacePass
                    records certain data for security, support, and reporting
                    purposes.
                  </span>
                </p>
              </div>
              <Button type="submit">Continue</Button>
            </form>
          </div>
        </main>
      ) : (
        <>
          <div className="fixed top-0 left-0 z-50 text-blue-500 p-10 ">
            <p className="cursor-pointer" onClick={cancel}>
              Cancel
            </p>
          </div>
          <div className="fixed VStack inset-0 bg-black z-40 flex items-center justify-between pb-14 pt-48">
            <div className="VStack gap-3 text-center justify-center items-center">
              {isGetStarted ? (
                <div className="VStack gap-8 items-center justify-center">
                  <p className="font-semibold text-3xl">
                    {faceDetected
                      ? "Move your head slowly to complete circle"
                      : "Reposition Your Face Within the Frame."}
                  </p>
                  {/* <p className="font-semibold text-lg">
                    {faceDetected
                      ? faceUp
                        ? "Your face is now: Up"
                        : faceDown
                        ? "Your face is now: Down"
                        : faceLeft
                        ? "Your face is now: Left"
                        : faceRight
                        ? "Your face is now: Right"
                        : "Your face is now: Center"
                      : "Reposition Your Face Within the Frame."}
                  </p> */}
                  <div
                    className={`relative w-80 h-80  ${getBlurClass()} transition-all duration-500 `}
                  >
                    <video
                      ref={videoRef}
                      className={`absolute w-full h-full object-cover scale-x-[-1] ${
                        faceDetected
                          ? `rounded-full ${getBorderClass()}`
                          : "rounded-lg"
                      }`}
                    />
                  </div>
                </div>
              ) : (
                <Image
                  src="images/face.gif"
                  className="w-56 h-56 object-cover rounded-full"
                  alt=""
                />
              )}
            </div>
            <div className="VStack gap-3 text-center justify-center items-center pt-20 text-white">
              <p className="text-lg font-semibold">How to Set Up FacePass</p>
              <p className="w-8/12">
                First, Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Maxime fuga voluptatibus voluptate quibusdam architecto quam.
              </p>
            </div>
            <div className="VStack items-center gap-3 justify-center">
              {!isGetStarted ? (
                <Button
                  onClick={startCamera}
                  className="mt-4 text-white text-base font-medium bg-blue-500 pt-6 pb-6 pl-32 pr-32"
                >
                  Get Started
                </Button>
              ) : (
                <Button
                  isDisabled={isButtonDisabled}
                  onClick={signUp}
                  className="mt-4 text-white text-base font-medium bg-blue-500 pt-6 pb-6 pl-32 pr-32"
                >
                  Continue
                </Button>
              )}
              {!isGetStarted && (
                <Button
                  onClick={() => onOpen()}
                  className="mt-4 text-white bg-transparent border-transparent opacity-75"
                >
                  Later
                </Button>
              )}
            </div>
          </div>
        </>
      )}
      <Modal
        className="w-96 h-48"
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalBody className="VStack w-full h-full justify-center gap-5 items-center">
            <div className="VStack w-full pt-5 gap-3">
              <p className="text-semibold text-lg">Set Up FacePass</p>
              <p className="opacity-75">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos,
                quod?
              </p>
            </div>
            <div className="VStack pl-3 pb-3 items-end justify-end w-full h-full">
              <div className="HStack w-full justify-between items-end">
                <Button className="bg-transparent opacity-75" onClick={signUp}>
                  Later
                </Button>
                <Button className="text-white bg-blue-500" onClick={onClose}>
                  Continue
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
