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
import useToken from "@/hooks/useToken";

export default function App() {
  const { setToken, userId } = useToken();
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
  const [isCompleted, setIsCompleted] = useState(false); // New state for final overlay

  const [recFaceUp, setRecFaceUp] = useState(false);
  const [recFaceDown, setRecFaceDown] = useState(false);
  const [recFaceCenter, setRecFaceCenter] = useState(false);
  const [recFaceLeft, setRecFaceLeft] = useState(false);
  const [recFaceRight, setRecFaceRight] = useState(false);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isGetStarted, setIsGetStarted] = useState(false);
  const [isRecorded, setIsRecorded] = useState(
    recFaceCenter && recFaceDown && recFaceLeft && recFaceRight && recFaceUp
  );
  const formatDate = (date: any) => moment(date).format("MM/DD/YYYY");

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
      console.error("Error accessing the camera:", error);
    }
  };
  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
  };

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play();

      // Check face every 1 second
      const intervalId = setInterval(() => {
        if (
          !recFaceCenter &&
          !recFaceDown &&
          !recFaceLeft &&
          !recFaceRight &&
          !recFaceUp
        ) {
          detectFace();
        } else {
          clearInterval(intervalId);
        }
      }, 1000);

      // return () => clearInterval(intervalId);
    }
  }, [videoStream]);

  useEffect(() => {
    if (
      recFaceCenter &&
      recFaceDown &&
      recFaceLeft &&
      recFaceRight &&
      recFaceUp
    ) {
      console.log("All face orientations recorded, stopping camera.");
      stopCamera();
    } else {
    }
  }, [recFaceCenter, recFaceDown, recFaceLeft, recFaceRight, recFaceUp]);

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

          // console.log("Nose Position:", nosePosition);
          // console.log('Left Eye Position:', leftEyePosition);
          // console.log('Right Eye Position:', rightEyePosition);

          const distance = (p1: any, p2: any) =>
            Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);

          const distLeftEyeToNose = distance(leftEyePosition, nosePosition);
          const distRightEyeToNose = distance(rightEyePosition, nosePosition);
          const distLeftEyeToRightEye = distance(
            leftEyePosition,
            rightEyePosition
          );

          // console.log('Distance from Left Eye to Nose:', distLeftEyeToNose);
          // console.log('Distance from Right Eye to Nose:', distRightEyeToNose);
          // console.log('Distance from Left Eye to Right Eye:', distLeftEyeToRightEye);

          const triangleArea = (a: any, b: any, c: any) => {
            const s = (a + b + c) / 2;
            return Math.sqrt(s * (s - a) * (s - b) * (s - c));
          };

          const area = triangleArea(
            distLeftEyeToNose,
            distRightEyeToNose,
            distLeftEyeToRightEye
          );

          // console.log("Triangle Area:", area);

          let orientation;

          const eyeThreshold = 0.15 * distLeftEyeToRightEye;
          const areaThreshold = 0.2 * distLeftEyeToRightEye;

          if (distLeftEyeToNose > distRightEyeToNose + eyeThreshold) {
            orientation = "left";
            if (!recFaceLeft) {
              setRecFaceLeft(true);
              try {
                await recordFace(orientation);
              } catch {
                setRecFaceLeft(false)
              }
            }
          } else if (distRightEyeToNose > distLeftEyeToNose + eyeThreshold) {
            orientation = "right";
            if (!recFaceRight) {
              setRecFaceRight(true);
              try {
                await recordFace(orientation);
              } catch {
                setRecFaceRight(false)
              }
            }
          } else if (area < 2000 * areaThreshold && nosePosition.y < 230) {
            orientation = "up";
            if (!recFaceUp) {
              setRecFaceUp(true);
              try {
                await recordFace(orientation);
              } catch {
                setRecFaceUp(false)
              }
            }
          } else if (area > 3000 * areaThreshold || nosePosition.y > 300) {
            orientation = "down";
            if (!recFaceDown) {
              setRecFaceDown(true);
              try {
                await recordFace(orientation);
              } catch {
                setRecFaceDown(false)
              }
            }
          } else {
            orientation = "center";
            if (!recFaceCenter) {
              setRecFaceCenter(true);
              try {
                await recordFace(orientation);
              } catch {
                setRecFaceCenter(false)
              }
            }
          }

          // console.log("Orientation Detected:", orientation);

          // if (
          //   recFaceCenter &&
          //   recFaceDown &&
          //   recFaceLeft &&
          //   recFaceRight &&
          //   recFaceUp
          // ) {
          //   console.log("All face orientations recorded, stopping camera.");
          //   stopCamera();
          // }
        } else {
          console.error("Landmarks data is missing");
        }
      } else {
        setFaceDetected(false);
        console.log("No face detected");
      }
    }
  };
  const recordFace = async (orientation: string) => {
    const userId = localStorage.getItem("userId");
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to a Blob (binary large object)
        canvas.toBlob(async (blob) => {
          if (blob) {
            const formData = new FormData();
            formData.append("image", blob, `face_${orientation}.jpg`);
            formData.append("orientation", orientation);
            formData.append("userId", userId || "");

            try {
              const response = await axios.post(
                `${BACKEND_URL}/auth/register-face`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );

              if (response.data.success) {
                console.log(
                  `Face registered successfully for ${orientation} orientation`
                );
              } else {
                console.error("Error registering face:", response.data.error);
              }
            } catch (error) {
              console.error(
                "Error registering face:",
                error.response ? error.response.data : error.message
              );
            }
          } else {
            console.error("Failed to convert canvas to Blob");
          }
        }, "image/jpeg");
      } else {
        console.error("Failed to get 2D context for canvas");
      }
    }
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
    setIsFaceSign(false);
    stopCamera();
    setIsGetStarted(false);
    setRecFaceCenter(false);
    setRecFaceDown(false);
    setRecFaceLeft(false);
    setRecFaceRight(false);
    setRecFaceUp(false);
    setFaceDetected(false);
  };
  const signUp = async () => {
    console.log("Sending registration data:", {
      first_name: firstName,
      last_name: lastName,
      date_of_birth: formattedBirthDate,
      gender,
      phone_number: phoneNumber,
      email,
    });

    try {
      const response = await axios.post(`${BACKEND_URL}/auth/register`, {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: formattedBirthDate,
        gender,
        phone_number: phoneNumber,
        email,
      });

      console.log("Registration successful!", response.data);

      // Extract userId from the response
      const userId = response.data.user.id;
      console.log("Received userId:", userId);

      if (userId) {
        localStorage.setItem("userId", userId);
        console.log(
          "userId saved to localStorage:",
          localStorage.getItem("userId")
        );

        // Optionally, navigate or trigger other actions
        // onOpen();
        // stopCamera();

        // setTimeout(() => {
        //   router.push("/sign-in");
        // }, 1500);
      } else {
        console.error("userId is undefined in the response data.");
      }
    } catch (error) {
      console.error(
        "Sign-up error:",
        error.response ? error.response.data : error.message
      );
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
    setIsRecorded(
      recFaceCenter && recFaceDown && recFaceLeft && recFaceRight && recFaceUp
    );
  }, [recFaceCenter, recFaceDown, recFaceLeft, recFaceRight, recFaceUp]);

  const handleContinue = async () => {
    if (faceDetected) {
      // Update completion status
      setIsCompleted(true);
      // Wait for 3 seconds
      setTimeout(async () => {
        // Navigate to /sign-in
        window.location.href = "/sign-in";
      }, 3000);
      // Optionally, you can also trigger sign-up here if needed
    }
  };

  return (
    <>
      {!isFaceSign && !isCompleted ? (
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
              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            </form>
          </div>
        </main>
      ) : isFaceSign && !isCompleted ? (
        <>
          <div className="fixed top-0 left-0 z-50 text-blue-500 p-10 ">
            <p className="cursor-pointer" onClick={cancel}>
              Cancel
            </p>
          </div>
          <div className="fixed VStack inset-0 bg-black z-40 flex items-center justify-between pb-14 pt-36">
            <div className="VStack gap-3 text-center justify-center items-center">
              {isGetStarted ? (
                <>
                  <p className="font-semibold text-3xl text-white">
                    {faceDetected
                      ? "Move your head slowly to complete circle"
                      : "Reposition Your Face Within the Frame."}
                  </p>
                  <p className="text-white">Keep your face centered within the frame.</p>
                  <div className="VStack items-center">
                    {faceDetected && (
                      <div
                        className={`${
                          recFaceUp ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        <Image
                          src="images/top.png"
                          className={`object-contain max-w-80 scale-[0.6] ${
                            !recFaceUp ? "opacity-20" : "opacity-100"
                          }`}
                          alt=""
                        />
                      </div>
                    )}
                    <div className="HStack">
                      {faceDetected && (
                        <div
                          className={`${
                            recFaceLeft ? "opacity-100" : "opacity-30"
                          }`}
                        >
                          <Image
                            src="images/left.png"
                            className="object-contain  max-h-80 scale-[0.6]"
                            alt=""
                          />
                        </div>
                      )}
                      <div
                        className={`relative w-80 h-80 bg-black transition-all duration-500 ${
                          faceDetected
                            ? "rounded-full border-4 border-blue-500"
                            : "rounded-lg"
                        } ${isRecorded ? " opacity-10" : "opacity-100"}`}
                      >
                        <video
                          ref={videoRef}
                          className={`absolute scale-x-[-1] w-full h-full object-cover ${
                            faceDetected ? "rounded-full" : "rounded-lg"
                          }`}
                        />
                      </div>
                      {faceDetected && (
                        <div
                          className={`${
                            recFaceRight ? "opacity-100" : "opacity-30"
                          }`}
                        >
                          <Image
                            src="images/right.png"
                            className="object-contain max-h-80 scale-[0.6]"
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                    {faceDetected && (
                      <div
                        className={`${
                          recFaceDown ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        <Image
                          src="images/down.png"
                          className="object-contain max-w-80 scale-[0.6]"
                          alt=""
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Image
                  src="images/face.gif"
                  className="w-56 h-56 object-cover rounded-full"
                  alt=""
                />
              )}
            </div>
            <div className="VStack gap-3 text-center justify-center items-center pt-20 text-white">
              {!isGetStarted && (
                <>
                  {" "}
                  <p className="text-lg font-semibold">
                    How to Set Up FacePass
                  </p>
                </>
              )}
              <p className="w-8/12">
                {!isGetStarted ? (
                  <>
                    {" "}
                    You’ll be asked to turn your face up, down, left, and right.
                    Follow the prompts and ensure your face stays within the
                    frame as you move. This helps FacePass capture all necessary
                    angles for reliable authentication.
                  </>
                ) : (
                  <>
                    To complete face registration, follow the on-screen
                    instructions to move your face up, down, left, and right.
                    This ensures that FacePass captures all necessary angles for
                    accurate recognition.
                  </>
                )}
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
                  isDisabled={!isRecorded} // Disable button if not all recFace states are true
                  className="mt-4 text-white text-base font-medium bg-blue-500 pt-6 pb-6 pl-32 pr-32"
                  onClick={handleContinue}
                >
                  Done
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
      ) : (
        <>
          <div className="fixed top-0 left-0 z-50 text-blue-500 p-10 ">
            <p className="cursor-pointer" onClick={cancel}>
              Cancel
            </p>
          </div>
          <div className="fixed VStack inset-0 bg-black z-40 flex items-center justify-between pb-14 pt-48">
            <div className="VStack gap-10 text-center justify-center items-center">
              <p className="text-3xl text-white font-medium">All Done!</p>
              <Image
                src="images/done-animate.gif"
                className="w-28 h-28 object-cover rounded-full"
                alt=""
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
