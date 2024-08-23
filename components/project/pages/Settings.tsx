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

export default function Settings({ project }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const deleteProject = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}//project/delete_project`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: project.project.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Project deleted successfully!", data);
        window.location.href = "/console";
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
                  <p>Title</p>
                  <div className="gap-1 HStack opacity-75 items-center">
                    <p>{project.project.title}</p>
                    <GoChevronRight className="font-normal text-base" />
                  </div>
                </div>
              </li>
              <li className="HStack w-full justify-between cursor-pointer pl-5 pr-5 pb-3 pt-3">
                <div className="HStack w-full justify-between items-center">
                  <p>Decsription</p>
                  <div className="gap-1 HStack opacity-75 items-center">
                    <p>{project.project.description}</p>
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
                    <p> Erase Entire Project</p>
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
                Remove Project
              </ModalHeader>
              <ModalBody>
                <p>
                  By choosing to remove a project from the FacePass platform,
                  you acknowledge and agree that this action is irreversible.
                  Once a project is deleted, all associated data, including user
                  information, configurations, and connected platform details,
                  will be permanently erased from our servers. It is your
                  responsibility to ensure that any necessary data backups are
                  made prior to initiating the removal process. FacePass will
                  not be held liable for any loss of data or disruption of
                  service that may occur as a result of project deletion.
                  Additionally, any active integrations or API connections
                  associated with the removed project will cease to function
                  immediately.
                </p>
                <p>
                  To remove a project, you must be an authorized administrator
                  of the FacePass account in question. This policy ensures that
                  only individuals with the appropriate permissions can initiate
                  such a significant action. The process involves navigating to
                  the project management section of the Developer Portal,
                  selecting the project to be removed, and confirming the
                  deletion through a two-step verification process. FacePass
                  reserves the right to log and monitor project removal requests
                  to maintain security and transparency. If you encounter any
                  issues during this process, our support team is available to
                  assist and provide guidance.
                </p>
              </ModalBody>
              <ModalFooter className="w-full justify-between">
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={onClose}
                  onClick={deleteProject}
                >
                  Erase Entire Project
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
