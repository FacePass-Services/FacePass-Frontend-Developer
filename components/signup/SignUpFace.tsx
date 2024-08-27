import React, { useRef, useState, useEffect } from 'react';
import { Button, Image } from '@nextui-org/react';
import * as faceapi from 'face-api.js';

interface SignUpFaceProps {
  faceDetected: boolean;
  isGetStarted: boolean;
  startCamera: () => void;
  handleContinue: () => void;
  cancel: () => void;
  onOpen: () => void;
}

const SignUpFace: React.FC<SignUpFaceProps> = ({
  faceDetected,
  startCamera,
  handleContinue,
  cancel,
  onOpen,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
const [isGetStarted, setIsGetStarted] = useState(false);
  // Load FaceAPI models
  useEffect(() => {
    const initializeFaceApi = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector_model-weights_manifest.json'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68_model-weights_manifest.json'),
      ]);
    };

    initializeFaceApi();
  }, []);

  // Get video stream
  useEffect(() => {
    const getVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setTimeout(() => {
            videoRef.current?.play();
          }, 500);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    if (isGetStarted) {
      getVideoStream();
    } else {
      setVideoStream(null);
    }
  }, [isGetStarted]);

  // Detect face
  useEffect(() => {
    const detectFace = async () => {
      if (videoRef.current && videoStream) {
        const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions());
        if (detections) {
          setIsButtonDisabled(false); // Enable the button when a face is detected
          console.log('Face detected:', detections);
        } else {
          setIsButtonDisabled(true); // Disable the button when no face is detected
          console.log('No face detected');
        }
      }
    };

    if (videoStream) {
      detectFace();
      const intervalId = setInterval(detectFace, 1000);
      return () => clearInterval(intervalId);
    }
  }, [videoStream]);

  const handleGetStarted = () => {
    setIsGetStarted(true);
    startCamera();
  };

  return (
    <>
      <div className="fixed top-0 left-0 z-50 text-blue-500 p-10">
        <p className="cursor-pointer" onClick={cancel}>
          Cancel
        </p>
      </div>
      <div className="fixed inset-0 bg-black z-40 flex items-center justify-between pb-14 pt-48">
        <div className="flex flex-col gap-3 text-center justify-center items-center">
          {isGetStarted ? (
            <>
              <p className="font-semibold text-3xl text-white">
                {faceDetected
                  ? 'Move your head slowly to complete the circle'
                  : 'Reposition Your Face Within the Frame'}
              </p>
              <div
                className={`relative w-80 h-80 transition-all duration-500 ${
                  faceDetected
                    ? 'rounded-full border-4 border-green-500'
                    : 'rounded-lg bg-gray-200'
                }`}
              >
                <video
                  ref={videoRef}
                  className={`absolute w-full h-full object-cover ${
                    faceDetected ? 'rounded-full' : 'rounded-lg'
                  }`}
                  autoPlay
                  muted
                />
              </div>
            </>
          ) : (
            <Image
              src="images/face.gif"
              className="w-56 h-56 object-cover rounded-full"
              alt="Face GIF"
            />
          )}
        </div>
        <div className="flex flex-col gap-3 text-center justify-center items-center pt-20 text-white">
          <p className="text-lg font-semibold">How to Set Up FacePass</p>
          <p className="w-8/12">
            First, Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime fuga voluptatibus voluptate quibusdam architecto quam.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 justify-center">
          {!isGetStarted ? (
            <Button
              onClick={handleGetStarted}
              className="mt-4 text-white text-base font-medium bg-blue-500 pt-6 pb-6 pl-32 pr-32"
            >
              Get Started
            </Button>
          ) : (
            <Button
              isDisabled={isButtonDisabled}
              onClick={handleContinue}
              className="mt-4 text-white text-base font-medium bg-blue-500 pt-6 pb-6 pl-32 pr-32"
            >
              Continue
            </Button>
          )}
          {!isGetStarted && (
            <Button
              onClick={onOpen}
              className="mt-4 text-white bg-transparent border-transparent opacity-75"
            >
              Later
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default SignUpFace;
