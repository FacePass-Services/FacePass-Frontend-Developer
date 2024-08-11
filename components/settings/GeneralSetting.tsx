import React, { useState, useEffect } from "react";
import { Input, Button, Image, Link } from "@nextui-org/react";
import { GoChevronRight } from "react-icons/go";
import { CiEdit } from "react-icons/ci";
import { MdDownloadDone } from "react-icons/md";
import { IoLockClosed } from "react-icons/io5";
import useToken from "@/hooks/useToken";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { BACKEND_URL } from "@/lib/config";

export default function General() {
  const { email, logout } = useToken();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const deleteuser = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/user/delete_user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("User deleted successfully!", data);

        logout();

        window.location.href = "/";
      } else {
        console.error("Error delete user:", data.message);
      }
    } catch (error) {
      console.error("Error delete user:", error);
    }
  };

  return (
    <section className="w-full h-full gap-5 items-center VStack">
      <section
        id="Toolbar"
        className="VStack md:w-8/12 w-full justify-between pl-2 pr-2"
      >
        <div className="VStack w-full">
          <section className="VStack gap-7 text-sm">
            <ul className="VStack divide-y dark:divide-gray-800 dark:bg-primary-dark bg-primary rounded-lg">
              <li className="HStack w-full justify-between cursor-pointer pl-5 pr-5 pb-3 pt-3">
                <div className="HStack w-full justify-between items-center">
                  <p>About</p>
                  <div className="gap-1 HStack opacity-75 items-center">
                    <>
                      <GoChevronRight className="font-normal text-base" />
                    </>
                  </div>
                </div>
              </li>
              <li className="HStack w-full justify-between cursor-pointer pl-5 pr-5 pb-3 pt-3">
                <div className="HStack w-full justify-between items-center">
                  <p>FacePass</p>
                  <div className="gap-1 HStack opacity-75 items-center">
                    <p>Version 0.2 developer beta 2</p>
                    <GoChevronRight className="font-normal text-base" />
                  </div>
                </div>
              </li>
            </ul>

            <div className="w-full">
              <ul className="VStack dark:bg-primary-dark bg-primary rounded-lg">
                <li className="HStack w-full justify-between cursor-pointer rounded-lg pl-5 pr-5 pb-3 pt-3">
                  <button
                    onClick={onOpen}
                    className="HStack text-red-500 w-full justify-between items-center"
                  >
                    <p>Erase All Data</p>
                  </button>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </section>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Remove FacePass Account
              </ModalHeader>
              <ModalBody>
                <p>
                  Developers on the FacePass Developer Platform
                  (Developer.facepass.net) must ensure they have legitimate
                  reasons for removing a User from a project, such as violations
                  of terms, inactivity, or security concerns, and must notify
                  Users, providing reasons and relevant documentation. Users
                  have the right to receive a notification about their removal,
                  including the reason and any potential appeal process.
                  Developers must provide a 7-day grace period for Users to
                  appeal or resolve issues before final removal, during which
                  Users can contact the Developer for clarification or dispute.
                  Post-removal, Developers must handle the User’s data per the
                  FacePass Privacy Policy and data protection regulations,
                  informing Users about data handling and options for retrieval
                  or deletion. Developers must review and respond to appeals
                  within a reasonable timeframe, providing a final decision.
                  Compliance with FacePass policies, including privacy and user
                  rights, is mandatory, and abuse of the removal process may
                  result in the Developer’s account suspension or termination.
                  By managing projects, Developers agree to these terms and
                  conditions for removing Users from projects.
                </p>
              </ModalBody>
              <ModalFooter className="w-full justify-between">
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" onPress={onClose} onClick={deleteuser}>
                  Erase All FacePass Account
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
