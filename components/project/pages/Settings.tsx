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

export default function Settings({ project } : any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const deleteProject = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000//project/delete_project", {
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
                Remove FacePass Account
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
                <p>
                  Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit
                  duis sit officia eiusmod Lorem aliqua enim laboris do dolor
                  eiusmod. Et mollit incididunt nisi consectetur esse laborum
                  eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt
                  nostrud ad veniam. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Nullam pulvinar risus non risus hendrerit
                  venenatis. Pellentesque sit amet hendrerit risus, sed
                  porttitor quam. Magna exercitation reprehenderit magna aute
                  tempor cupidatat consequat elit dolor adipisicing. Mollit
                  dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
                  officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et
                  mollit incididunt nisi consectetur esse laborum eiusmod
                  pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad
                  veniam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
                <p>
                  Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit
                  duis sit officia eiusmod Lorem aliqua enim laboris do dolor
                  eiusmod. Et mollit incididunt nisi consectetur esse laborum
                  eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt
                  nostrud ad veniam. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Nullam pulvinar risus non risus hendrerit
                  venenatis. Pellentesque sit amet hendrerit risus, sed
                  porttitor quam. Magna exercitation reprehenderit magna aute
                  tempor cupidatat consequat elit dolor adipisicing. Mollit
                  dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
                  officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et
                  mollit incididunt nisi consectetur esse laborum eiusmod
                  pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad
                  veniam.
                </p>
              </ModalBody>
              <ModalFooter className="w-full justify-between">
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" onPress={onClose} onClick={deleteProject}>
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
