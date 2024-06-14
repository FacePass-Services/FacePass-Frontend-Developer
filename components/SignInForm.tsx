import React, { useState, useEffect } from "react";
import { Input, Button, Checkbox, Link } from "@nextui-org/react";
import axios from "axios";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

import useToken from "@/hooks/useToken";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

type SignInFormProps = {
  isDeveloperPage?: boolean;
};

const SignInForm: React.FC<SignInFormProps> = ({ isDeveloperPage = false }) => {
  const { setToken, role } = useToken();
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [emailEntered, setEmailEntered] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checked, setChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false); // State for login success

  type CheckedStates = {
    sub_a: boolean;
    sub_b: boolean;
    sub_c: boolean;
  };

  const [checkedStates, setCheckedStates] = useState<CheckedStates>({
    sub_a: false,
    sub_b: false,
    sub_c: false,
  });

  const handleCheckboxChange = (id: keyof CheckedStates) => {
    setCheckedStates((prevCheckedStates) => ({
      sub_a: id === "sub_a" ? !prevCheckedStates.sub_a : false,
      sub_b: id === "sub_b" ? !prevCheckedStates.sub_b : false,
      sub_c: id === "sub_c" ? !prevCheckedStates.sub_c : false,
    }));
  };

  let tabs = [
    {
      id: "sub_a",
      label: "Lite",
      content: (
        <>
          <div className="VStack gap-5">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <Table hideHeader aria-label="Example static collection table">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>ROLE</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell>
                    <IoCheckmarkCircle className="text-green-500" />
                  </TableCell>
                  <TableCell>Face Authentication</TableCell>
                </TableRow>
                <TableRow key="2">
                  <TableCell>
                    <IoCheckmarkCircle className="text-green-500" />
                  </TableCell>
                  <TableCell>Technical Support</TableCell>
                </TableRow>
                <TableRow key="3">
                  <TableCell>
                    <IoCloseCircle className="text-red-500" />
                  </TableCell>
                  <TableCell>Prof of Location</TableCell>
                </TableRow>
                <TableRow key="4">
                  <TableCell>
                    <IoCloseCircle className="text-red-500" />
                  </TableCell>
                  <TableCell>Unlimited Projects</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Checkbox
              id="lite"
              checked={checkedStates.sub_a}
              onChange={() => handleCheckboxChange("sub_a")}
            >
              I have read terms and services
            </Checkbox>
          </div>
        </>
      ),
    },
    {
      id: "sub_b",
      label: "Plus",
      content: (
        <>
          <div className="VStack gap-5">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <Table hideHeader aria-label="Example static collection table">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>ROLE</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell>
                    <IoCheckmarkCircle className="text-green-500" />
                  </TableCell>
                  <TableCell>Face Authentication</TableCell>
                </TableRow>
                <TableRow key="2">
                  <TableCell>
                    <IoCheckmarkCircle className="text-green-500" />
                  </TableCell>
                  <TableCell>Technical Support</TableCell>
                </TableRow>
                <TableRow key="3">
                  <TableCell>
                    <IoCheckmarkCircle className="text-green-500" />
                  </TableCell>
                  <TableCell>Proof of Location</TableCell>
                </TableRow>
                <TableRow key="4">
                  <TableCell>
                    <IoCloseCircle className="text-red-500" />
                  </TableCell>
                  <TableCell>Unlimited Projects</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Checkbox
              id="plus"
              checked={checkedStates.sub_b}
              onChange={() => handleCheckboxChange("sub_b")}
            >
              I have read terms and services
            </Checkbox>
          </div>
        </>
      ),
    },
    {
      id: "sub_c",
      label: "Pro",
      content: (
        <>
          <div className="VStack gap-5">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <Table hideHeader aria-label="Example static collection table">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>ROLE</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell>
                    <IoCheckmarkCircle className="text-green-500" />
                  </TableCell>
                  <TableCell>Face Authentication</TableCell>
                </TableRow>
                <TableRow key="2">
                  <TableCell>
                    <IoCheckmarkCircle className="text-green-500" />
                  </TableCell>
                  <TableCell>Technical Support</TableCell>
                </TableRow>
                <TableRow key="3">
                  <TableCell>
                    <IoCheckmarkCircle className="text-green-500" />
                  </TableCell>
                  <TableCell>Proof of Location</TableCell>
                </TableRow>
                <TableRow key="4">
                  <TableCell>
                    <IoCheckmarkCircle className="text-green-500" />
                  </TableCell>
                  <TableCell>Unlimited Projects</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Checkbox
              id="pro"
              checked={checkedStates.sub_c}
              onChange={() => handleCheckboxChange("sub_c")}
            >
              I have read terms and services
            </Checkbox>
          </div>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (signedIn && role !== "user") {
      window.location.href = "/developer";
    }
  }, [signedIn, role]);

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

  const sendPasscode = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/auth/send_passcode",
        { email }
      );
      console.log("Passcode sent!", response.data);
    } catch (error) {
      console.error("Passcode error:", error);
    }
  };

  const loginUser = async (credentials: any) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/auth/login",
        credentials,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Login response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const handleSignInAsDeveloper = async () => {
    if (checkedStates.sub_a || checkedStates.sub_b || checkedStates.sub_c) {
      try {
        if (checkedStates.sub_a) {
          await axios.post("http://127.0.0.1:5000/auth/upgrade_dev_lite", {
            email,
          });
          console.log("Role upgraded to 'dev_lite'");
        } else if (checkedStates.sub_b) {
          await axios.post("http://127.0.0.1:5000/auth/upgrade_dev_plus", {
            email,
          });
          console.log("Role upgraded to 'dev_plus'");
        } else if (checkedStates.sub_c) {
          await axios.post("http://127.0.0.1:5000/auth/upgrade_dev_pro", {
            email,
          });
          console.log("Role upgraded to 'dev_pro'");
        }
        window.location.href = "/";
      } catch (error) {
        console.error("Error updating role:", error);
      }
    } else {
      alert(
        "Please check at least one of the checkboxes to sign in as a developer."
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailEntered && email !== "") {
      const exists = await checkEmailExists(email);
      if (exists) {
        setEmailExists(true);
        setEmailEntered(true);
        await sendPasscode();
      } else {
        setErrorMessage("Email not found. Please check your email.");
        setEmailExists(false);
      }
    } else if (emailEntered && passcode !== "") {
      try {
        const response = await loginUser({ email, passcode });
        console.log("Response to setToken:", response);
        setToken(response);
        setSignedIn(true);
        setLoginSuccess(true); // Set login success to true
        // setTimeout(() => {
        //   window.location.href = "/"; 
        // }, 1500);
      } catch (error) {
        console.error("Login error:", error);
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage("");
  };

  return (
    <>
      {!signedIn ? (
        <form onSubmit={handleSubmit} className="VStack gap-5 w-full">
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Input
              variant="bordered"
              type="email"
              label="Email"
              value={email}
              onChange={handleEmailChange}
              isDisabled={emailEntered}
            />
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {emailEntered && emailExists && (
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
              <Input
                type="password"
                label="Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
            </div>
          )}
          <Button type="submit">{emailEntered ? "Sign In" : "Continue"}</Button>
          <div className="w-full VStack items-center ">
            <Link className="opacity-25 underline" href="/sign-up">
              Create FacePass account now
            </Link>
          </div>
        </form>
      ) : (
        role === "user" &&
        isDeveloperPage && (
          <>
            <div className="VStack w-9/12 items-center">
              <Tabs aria-label="Dynamic tabs" items={tabs}>
                {(item) => (
                  <Tab key={item.id} title={item.label}>
                    <Card>
                      <CardBody>{item.content}</CardBody>
                    </Card>
                  </Tab>
                )}
              </Tabs>
              <Button className="w-fit" onClick={handleSignInAsDeveloper}>
                Sign In as Developer
              </Button>
            </div>
          </>
        )
      )}
      {loginSuccess && (
        <div className="success-message">
          Logged in successfully! Redirecting...
        </div>
      )}
    </>
  );
};

export default SignInForm;
