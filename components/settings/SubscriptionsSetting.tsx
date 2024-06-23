import React, { useState } from "react";
import { Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { GoChevronRight } from "react-icons/go";
import {
  Image,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import useToken from "@/hooks/useToken";

export default function Subscriptions() {
  const router = useRouter();
  const { role, email, setToken } = useToken();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSuccess, setSuccess] = useState(false);
  const handleChange = async (plan: string) => {
    let endpoint;
    switch (plan) {
      case "a":
        endpoint = "http://127.0.0.1:5000/auth/upgrade_dev_lite";
        break;
      case "b":
        endpoint = "http://127.0.0.1:5000/auth/upgrade_dev_plus";
        break;
      case "c":
        endpoint = "http://127.0.0.1:5000/auth/upgrade_dev_pro";
        break;
      default:
        return;
    }

    try {
      const response = await axios.post(endpoint, { email });
      const updatedToken = response.data; // assuming the API returns the updated token
      setSuccess(true);
      setToken(updatedToken);
      console.log(`Role upgraded to ${plan}`);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error upgrading role:", error);
    }
  };

  return (
    <>
      <section className="w-full h-full gap-5 items-center VStack">
        <section
          id="Toolbar"
          className="VStack md:w-8/12 w-full justify-between pl-2 pr-2"
        >
          <div className="VStack w-full">
            <section className="VStack gap-7 text-sm">
              <ul className="VStack divide-y dark:divide-gray-800 dark:bg-primary-dark bg-primary rounded-lg">
                <li
                  onClick={onOpen}
                  className="HStack w-full justify-between cursor-pointer pl-5 pr-5 pb-3 pt-3"
                >
                  <div className="HStack w-full justify-between items-center">
                    <p>Plan</p>
                    <div className="gap-1 HStack opacity-75 items-center">
                      <>
                        {role === "dev_pro" && <p>Pro</p>}
                        {role === "dev_plus" && <p>Plus</p>}
                        {role === "dev_lite" && <p>Lite</p>}
                        <GoChevronRight className="font-normal text-base" />
                      </>
                    </div>
                  </div>
                </li>
              </ul>
              <Table hideHeader aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn>NAME</TableColumn>
                  <TableColumn>ROLE</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key="1">
                    <TableCell>
                      {(role === "dev_pro" ||
                        role === "dev_lite" ||
                        role === "dev_plus") && (
                        <IoCheckmarkCircle className="text-green-500" />
                      )}
                    </TableCell>
                    <TableCell>Face Authentication</TableCell>
                  </TableRow>
                  <TableRow key="2">
                    <TableCell>
                      {(role === "dev_pro" ||
                        role === "dev_lite" ||
                        role === "dev_plus") && (
                        <IoCheckmarkCircle className="text-green-500" />
                      )}
                    </TableCell>
                    <TableCell>Technical Support</TableCell>
                  </TableRow>
                  <TableRow key="3">
                    <TableCell>
                      {role === "dev_pro" || role === "dev_plus" ? (
                        <IoCheckmarkCircle className="text-green-500" />
                      ) : (
                        <IoCloseCircle className="text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>Proof of Location</TableCell>
                  </TableRow>
                  <TableRow key="4">
                    <TableCell>
                      {role === "dev_pro" ? (
                        <IoCheckmarkCircle className="text-green-500" />
                      ) : (
                        <IoCloseCircle className="text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>Unlimited Projects</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="w-full">
                <ul className="VStack dark:bg-primary-dark bg-primary rounded-lg">
                  <li className="HStack w-full justify-between cursor-pointer rounded-lg pl-5 pr-5 pb-3 pt-3">
                    <Link
                      onClick={onOpen}
                      className="HStack text-blue-500 w-full justify-between items-center"
                    >
                      <p>Choose new plans</p>
                    </Link>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </section>
        <Modal isOpen={isOpen} placement="auto" onOpenChange={onOpenChange}>
          <ModalContent className="max-w-full">
            {(onClose) => (
              <>
                {!isSuccess ? (
                  <ModalBody>
                    <div className="flex flex-col items-center justify-center p-4 text-primary-dark dark:text-primary md:p-10">
                      <h2 className="text-2xl font-medium md:text-4xl">
                        Choose your new Plans
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
                                <span className="ml-2">
                                  Face Authentication
                                </span>
                              </li>
                              <li className="flex items-center">
                                <IoCheckmarkCircle className="text-green-500" />
                                <span className="ml-2">Technical Support</span>
                              </li>
                            </ul>
                          </div>
                          <div className="flex px-4 pb-4 justify-center md:px-10 md:pb-10">
                            <button
                              onClick={() => handleChange("a")}
                              className="flex dark:bg-primary-dark items-center justify-center w-full h-12 px-6 text-sm uppercase bg-gray-200 rounded-lg"
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
                              onClick={() => handleChange("c")}
                              className="flex dark:bg-primary-dark items-center justify-center w-full h-12 px-6 text-sm uppercase bg-gray-200 rounded-lg"
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
                              onClick={() => handleChange("b")}
                              className="flex dark:bg-primary-dark items-center justify-center w-full h-12 px-6 text-sm uppercase bg-gray-200 rounded-lg"
                            >
                              Choose
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                ) : (
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
                )}
              </>
            )}
          </ModalContent>
        </Modal>
      </section>
    </>
  );
}
