"use client";
import React, { useState } from "react";
import axios from "axios";
import { Input, Button, DatePicker } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import moment from "moment";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  RadioGroup,
  Radio,
} from "@nextui-org/react";

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
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

  const router = useRouter();

  const formatDate = (date: any) => {
    return moment(date).format("MM/DD/YYYY");
  };

  const checkEmailExists = async (email: string) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/check_email", {
        email,
      });
      return response.data.exists;
    } catch (error) {
      console.error("Check email error:", error);
      return false;
    }
  };

  const signUp = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/auth/register", {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: formattedBirthDate,
        gender,
        phone_number: phoneNumber,
        email,
      });

      console.log("Registration successful!", response.data);
      onOpen();

      setTimeout(() => {
        router.push("/sign-in");
      }, 1500);
    } catch (error) {
      console.error("Sign-up error:", error);
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
      signUp();
    }
  };

  return (
    <main className="VStack min-h-screen items-center pb-10 w-10/12">
      <div className="VStack gap-5 items-center pt-10">
        <p className="font-semibold text-3xl">Create Your FacePass Account</p>
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
              setFormattedBirthDate(date !== null ? formatDate(date) : null);
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
          {genderError && <p className="text-red-500 text-sm">{genderError}</p>}
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
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <div className="w-full">
            <p className="text-xs text-center">
              <span className="opacity-75">
                Your FacePass account information is used to allow you to sign
                in securely and access your data. <br /> FacePass records
                certain data for security, support, and reporting purposes.
              </span>
            </p>
          </div>
          <Button type="submit">Sign Up</Button>
        </form>
      </div>
      <Modal className=" w-96 h-96" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <>
            <ModalBody className="VStack w-full h-full justify-center gap-5 items-center">
              <Image
                src="images/done-animate.gif"
                className="w-36 h-36 object-cover rounded-full"
                alt=""
              />
              <p className="text-black dark:text-white font-medium text-3xl">
                Done
              </p>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </main>
  );
}
