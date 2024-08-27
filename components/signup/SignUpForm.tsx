import React, { useState } from 'react';
import { Input, Button, DatePicker, RadioGroup, Radio } from '@nextui-org/react';
import moment from 'moment';
import { DateValue } from '@nextui-org/react';

interface SignUpFormProps {
  onFormSubmit: (data: any) => void;
  errorMessage: string;
  firstNameError: string;
  lastNameError: string;
  birthDateError: string;
  genderError: string;
  phoneNumberError: string;
  emailError: string;
  setIsFaceSign: (isFaceSign: boolean) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  onFormSubmit,
  errorMessage,
  firstNameError,
  lastNameError,
  birthDateError,
  genderError,
  phoneNumberError,
  emailError,
  setIsFaceSign,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState<DateValue | null>(null);
  const [formattedBirthDate, setFormattedBirthDate] = useState<string | null>(null);
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit({
      firstName,
      lastName,
      birthDate: formattedBirthDate,
      gender,
      phoneNumber,
      email,
    });
    setIsFaceSign(true);
  };

  const formatDate = (date: DateValue | null) => {
    return date ? moment(date as unknown as Date).format('MM/DD/YYYY') : null;
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
                }}
              />
              {firstNameError && <p className="text-red-500 text-sm">{firstNameError}</p>}
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
                }}
              />
              {lastNameError && <p className="text-red-500 text-sm">{lastNameError}</p>}
            </div>
          </div>
          <DatePicker
            isRequired
            variant="bordered"
            label="Birth date"
            value={birthDate}
            onChange={(date) => {
              setBirthDate(date);
              setFormattedBirthDate(formatDate(date));
            }}
            className="w-full"
          />
          {birthDateError && <p className="text-red-500 text-sm">{birthDateError}</p>}
          <RadioGroup
            isRequired
            label="Select your gender"
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
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
              }}
            />
          </div>
          {phoneNumberError && <p className="text-red-500 text-sm">{phoneNumberError}</p>}
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
              }}
            />
          </div>
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          <div className="w-full">
            <p className="text-xs text-center">
              <span className="opacity-75">
                Your FacePass account information is used to allow you to sign in securely and access your data. <br /> FacePass records certain data for security, support, and reporting purposes.
              </span>
            </p>
          </div>
          <Button type="submit">Continue</Button>
        </form>
      </div>
    </main>
  );
};

export default SignUpForm;
