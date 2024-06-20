"use client";
import React, { useState, useEffect } from "react";
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
  const [formattedBirthDate, setFormattedBirthDate] = useState<string | null>(null);
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();

  const formatDate = (date: any) => {
    return moment(date).format("MM/DD/YYYY");
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    signUp();
  };

  return (
    <main className="VStack min-h-screen items-center pb-10 w-10/12">
      <div className="VStack gap-5 items-center pt-10">
        <p className="font-semibold text-3xl">Create Your FacePass Account</p>
        <p>One FacePass account is all you need to access all services.</p>
        <form onSubmit={handleSubmit} className="VStack gap-5">
          <div className="HStack gap-5">
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
              <Input
                variant="bordered"
                type="text"
                label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
              <Input
                variant="bordered"
                type="text"
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <DatePicker
            variant="bordered"
            label="Birth date"
            value={birthDate}
            onChange={(date) => {
              setBirthDate(date);
              setFormattedBirthDate(date !== null ? formatDate(date) : null);
            }}
            className="w-full"
          />
          <RadioGroup
            label="Select your gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            orientation="horizontal"
          >
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
          </RadioGroup>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Input
              variant="bordered"
              type="number"
              label="Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap justify-end gap-4">
            <Input
              variant="bordered"
              type="email"
              label="Email"
              description="This will be your connected email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
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
      <Modal className=" w-96 h-96" isOpen={isOpen} onOpenChange={onOpenChange} >
        <ModalContent>
          <>
            <ModalBody className="VStack w-full h-full justify-center gap-5 items-center">
              <Image
                src="images/done-animate.gif"
                className="w-36 h-36 object-cover"
                alt=""
              />
              <p className="text-black font-medium text-3xl">Done</p>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </main>
  );
}
