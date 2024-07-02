import React, { useState, useEffect } from "react";
import { Input, Button, Checkbox, Link, ModalHeader } from "@nextui-org/react";
import axios from "axios";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import useToken from "@/hooks/useToken";
import { Image, Modal, ModalContent, ModalBody } from "@nextui-org/react";
import { BACKEND_URL } from "@/lib/config";

type SignInFormProps = {
  isDeveloperPage?: boolean;
};

const SignInForm: React.FC<SignInFormProps> = ({ isDeveloperPage = false }) => {
  const { setToken, role } = useToken();
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const user_id = useToken();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [emailEntered, setEmailEntered] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checked, setChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleChange = async (plan: string) => {
    let endpoint;
    switch (plan) {
      case "a":
        endpoint = `${BACKEND_URL}/auth/upgrade_dev_lite`;
        break;
      case "b":
        endpoint = `${BACKEND_URL}/auth/upgrade_dev_plus`;
        break;
      case "c":
        endpoint = `${BACKEND_URL}/auth/upgrade_dev_pro`;
        break;
      default:
        return;
    }

    try {
      const response = await axios.post(endpoint, { email });
      const updatedToken = response.data; // assuming the API returns the updated token
      setToken(updatedToken);
      console.log(`Role upgraded to ${plan}`);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error upgrading role:", error);
    }
  };

  useEffect(() => {
    if (signedIn && role !== "user") {
      window.location.href = "/";
    }
  }, [signedIn, role]);

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

  const sendPasscode = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/send_passcode`,
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
        `${BACKEND_URL}/auth/login`,
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
    if (selectedPlan && checked) {
      try {
        await handleChange(selectedPlan);
        setIsSuccessModalOpen(true);

        setTimeout(() => {
          // router.push(`/payment/${user_id}`);
          router.push("/");
        }, 1500);
      } catch (error) {
        console.error("Error updating role:", error);
      }
    } else {
      alert(
        "Please select a plan and agree to the terms and services to sign in as a developer."
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailEntered) {
      if (!email) {
        setEmailError("Please enter your email.");
        return;
      }
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
      } catch (error) {
        console.error("Login error:", error);
        setPasscodeError("Incorrect passcode. Please try again.");
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
    setErrorMessage("");
    setPasscodeError("");
  };

  return (
    <>
      {!signedIn ? (
        <>
          <p className="font-semibold text-3xl">
            Sign In to FacePass Developer Account
          </p>
          <p>Manage your FacePass account</p>
          <form
            onSubmit={handleSubmit}
            className="VStack lg:w-4/12 gap-5 w-full"
          >
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
              <Input
                isRequired
                variant="bordered"
                type="email"
                label="Email"
                value={email}
                onChange={handleEmailChange}
                isDisabled={emailEntered}
              />
            </div>
            {emailError && (
              <div className="error-message text-red-500">{emailError}</div>
            )}
            {errorMessage && (
              <div className="error-message text-red-500">{errorMessage}</div>
            )}
            {emailEntered && emailExists && (
              <div className="VStack flex w-full flex-wrap md:flex-nowrap gap-4">
                <Input
                  type="password"
                  label="Passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                />
                {passcodeError && (
                  <div className="error-message text-red-500">
                    {passcodeError}
                  </div>
                )}
              </div>
            )}
            <Button type="submit">
              {emailEntered ? "Sign In" : "Continue"}
            </Button>
            <div className="w-full VStack items-center">
              <Link className="opacity-25 underline" href="/sign-up">
                Create FacePass account now
              </Link>
            </div>
          </form>
        </>
      ) : (
        role === "user" &&
        isDeveloperPage && (
          <>
            <div className="VStack w-full gap-5 items-center">
              <div className="flex flex-col items-center justify-center p-4 text-primary-dark dark:text-primary md:p-10">
                <h2 className="text-2xl font-medium md:text-4xl">
                  Choose your new Plan
                </h2>
                <div className="flex flex-wrap items-center justify-center w-full max-w-4xl mt-4 md:mt-8">
                  <div className="flex flex-col flex-grow mt-4 overflow-hidden bg-tertiary dark:bg-tertiary-dark rounded-lg shadow-lg md:mt-8">
                    <div className="flex flex-col items-center p-4 bg-gray-200 dark:bg-primary-dark md:p-10">
                      <span className="font-semibold">Lite</span>
                      <div className="flex items-center">
                        <span className="text-xl md:text-3xl">$</span>
                        <span className="text-3xl font-bold md:text-5xl">
                          99
                        </span>
                        <span className="text-sm text-gray-500 md:text-2xl">
                          /yr
                        </span>
                      </div>
                    </div>
                    <div className="p-4 md:p-10">
                      <ul>
                        <li className="flex items-center">
                          <IoCheckmarkCircle className="text-green-500" />
                          <span className="ml-2">Face Authentication</span>
                        </li>
                        <li className="flex items-center">
                          <IoCheckmarkCircle className="text-green-500" />
                          <span className="ml-2">Technical Support</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex px-4 pb-4 justify-center md:px-10 md:pb-10">
                      <button
                        onClick={() => setSelectedPlan("a")}
                        className={`flex items-center justify-center w-full h-12 px-6 text-sm uppercase bg-gray-200 rounded-lg ${
                          selectedPlan === "a" ? "bg-transparent font-bold" : ""
                        }`}
                      >
                        Choose
                      </button>
                    </div>
                  </div>

                  {/* <!-- Tile 2 --> */}
                  <div className="z-10 flex flex-col flex-grow mt-4 overflow-hidden transform bg-primary dark:bg-tertiary-dark rounded-lg shadow-lg md:mt-8 md:scale-110">
                    <div className="flex flex-col items-center p-4 bg-gray-200 dark:bg-primary-dark md:p-10">
                      <span className="font-semibold">Pro</span>
                      <div className="flex items-center">
                        <span className="text-xl md:text-3xl">$</span>
                        <span className="text-4xl font-bold md:text-6xl">
                          499
                        </span>
                        <span className="text-sm text-gray-500 md:text-2xl">
                          /yr
                        </span>
                      </div>
                    </div>
                    <div className="p-4 md:p-10">
                      <ul>
                        <li className="flex items-center">
                          <IoCheckmarkCircle className="text-green-500" />
                          <span className="ml-2 italic">
                            Face Authentication
                          </span>
                        </li>
                        <li className="flex items-center">
                          <IoCheckmarkCircle className="text-green-500" />
                          <span className="ml-2">Technical Support</span>
                        </li>
                        <li className="flex items-center">
                          <IoCheckmarkCircle className="text-green-500" />
                          <span className="ml-2">Proof of Location</span>
                        </li>
                        <li className="flex items-center">
                          <IoCheckmarkCircle className="text-green-500" />
                          <span className="ml-2">Unlimited Projects</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex px-4 pb-4 justify-center md:px-10 md:pb-10">
                      <button
                        onClick={() => setSelectedPlan("c")}
                        className={`flex items-center justify-center w-full h-12 px-6 text-sm uppercase bg-gray-200 rounded-lg ${
                          selectedPlan === "c" ? "bg-transparent font-bold" : ""
                        }`}
                      >
                        Choose
                      </button>
                    </div>
                  </div>

                  {/* <!-- Tile 3 --> */}
                  <div className="flex flex-col flex-grow mt-4 overflow-hidden bg-primary dark:bg-tertiary-dark rounded-lg shadow-lg md:mt-8">
                    <div className="flex flex-col items-center p-4 bg-gray-200 dark:bg-primary-dark md:p-10">
                      <span className="font-semibold">Plus</span>
                      <div className="flex items-center">
                        <span className="text-xl md:text-3xl">$</span>
                        <span className="text-3xl font-bold md:text-5xl">
                          199
                        </span>
                        <span className="text-sm text-gray-500 md:text-2xl">
                          /yr
                        </span>
                      </div>
                    </div>
                    <div className="p-4 md:p-10">
                      <ul>
                        <li className="flex items-center">
                          <IoCheckmarkCircle className="text-green-500" />
                          <span className="ml-2 italic">
                            Face Authentication
                          </span>
                        </li>
                        <li className="flex items-center">
                          <IoCheckmarkCircle className="text-green-500" />
                          <span className="ml-2">Technical Support</span>
                        </li>
                        <li className="flex items-center">
                          <IoCheckmarkCircle className="text-green-500" />
                          <span className="ml-2">Proof of Location</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex px-4 pb-4 justify-center md:px-10 md:pb-10">
                      <button
                        onClick={() => setSelectedPlan("b")}
                        className={`flex items-center justify-center w-full h-12 px-6 text-sm uppercase bg-gray-200 rounded-lg ${
                          selectedPlan === "b" ? "bg-transparent font-bold" : ""
                        }`}
                      >
                        Choose
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <Checkbox checked={checked} onChange={() => setChecked(!checked)}>
                I have read{" "}
                <span
                  className=" underline text-blue-500"
                  onClick={() => setIsTermsModalOpen(true)}
                >
                  {" "}
                  terms and policy
                </span>
              </Checkbox>
              <Button className="w-fit" onClick={handleSignInAsDeveloper}>
                Sign In as Developer
              </Button>
            </div>
          </>
        )
      )}

      <Modal
        className=" "
        isOpen={isTermsModalOpen}
        onOpenChange={setIsTermsModalOpen}
        scrollBehavior="inside"
      >
        <ModalContent>
          <>
            <ModalHeader>
              Terms and Conditions for Upgrading to a Developer Account
            </ModalHeader>
            <ModalBody className="VStack w-full h-full justify-center gap-5 items-center">
              <p className="text-black dark:text-white ">
                By upgrading your FacePass account from a normal user to a
                developer account, you agree to the following terms and
                conditions. Upon purchase, you will gain access to
                developer-specific features, including the ability to create
                multiple projects, access to comprehensive documentation, and
                enhanced support services. This upgrade is intended to
                facilitate the integration of FacePass&apos;s authentication services
                into your own applications. You acknowledge that the developer
                account is subject to a recurring subscription fee, which will
                be billed automatically unless canceled. You are responsible for
                ensuring that your payment information is accurate and
                up-to-date to avoid any interruptions in service.
                <br />
                Furthermore, as a developer account holder, you agree to use the
                FacePass platform in compliance with all applicable laws and
                regulations. Any misuse of the service, including but not
                limited to, unauthorized access, data breaches, or activities
                that compromise the integrity of the FacePass system, will
                result in immediate termination of your account without refund.
                FacePass reserves the right to modify these terms and conditions
                at any time, with any changes being effective immediately upon
                posting. It is your responsibility to regularly review these
                terms to stay informed of any updates. Your continued use of the
                developer account signifies your acceptance of any changes.
              </p>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>

      <Modal
        className=" w-96 h-96"
        isOpen={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      >
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
    </>
  );
};

export default SignInForm;
