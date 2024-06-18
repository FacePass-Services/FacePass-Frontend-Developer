'use client'
import React, { useState } from "react";
import { Link } from "@nextui-org/react";
import { GoArrowUpRight } from "react-icons/go";
import { Modal, useDisclosure, Button } from "@nextui-org/react";
import Projects from "@/components/console/Projects";
import CreateProject from "@/components/console/CreateProject";
import Waves from "@/components/console/Waves";

export default function App() {
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <main className="VStack w-screen min-h-screen items-center pb-10">
      <section className="VStack w-full dark:bg-primary-dark bg-primary items-center">
        <div className="w-9/12 pt-28 VStack gap-3 pb-20">
          <p className="text-2xl font-medium">Welcome to FacePass!</p>
          <p className="w-4/12">
            Tools from FacePass for building app infrastructure, improving app
            quality, and growing your business
          </p>
          <div className="HStack gap-10 mt-7">
            <Button
              onClick={handleButtonClick}
              radius="full"
              className=" bg-primary-dark dark:bg-primary dark:text-primary-dark text-primary pl-7 pr-7 pt-3 pb-3"
            >
              Create a project
            </Button>

            <Link href="/developer/documentation" className="HStack gap-1 text-primary-dark">
              <p>Documentation</p>
              <GoArrowUpRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>
      <Waves />
      <section className="w-full items-center pl-10 mt-10 pr-10 h-full overflow-y-auto">
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 items-center">
          <Projects />
        </div>
      </section>

      {showModal && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
          onClick={handleCloseModal}
        >
          <div
            className="bg-secondary dark:bg-secondary-dark dark:bg-dark-secondary p-4 rounded-md text-center min-w-[400px] h-auto flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <CreateProject />
          </div>
        </div>
      )}
    </main>
  );
}
