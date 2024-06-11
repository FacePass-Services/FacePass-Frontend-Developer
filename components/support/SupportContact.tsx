import React from "react";
import SupportForm from "@/components/support/SupportForm"; // Import SupportForm component if exists
import {
  Modal,
  ModalContent,
  Button,
  useDisclosure,
  Image,
} from "@nextui-org/react";

const SupportContact = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
const supportImg = "images/support.png"
  return (
    <>
      <section className="VStack items-center p-10 pt-12 gap-4 text-center md:h-[600px] bg-primary dark:bg-primary-dark rounded-lg shadow-sm relative overflow-hidden">
        <div className="gap-4 VStack items-center z-10">
          <p className="font-medium text-3xl">Get Support</p>
          <p className="opacity-70">
            Give us a few details and we’ll offer the best solution. Connect by
            phone, email, and more.
          </p>
          <Button
            radius="full"
            className="bg-primary-dark dark:bg-secondary-dark text-white w-fit shadow-lg"
            onPress={onOpen}
          >
            Start now
          </Button>
        </div>
        <Image
          src={supportImg}
          className=" bottom-0 left-0 w-full h-full max-h-[400px] object-contain z-0"
          alt="Support"
        />
      </section>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <section className="w-full h-full VStack items-center gap-5 p-5 pt-10">
                <p className="font-medium text-2xl">Get in touch</p>
                <SupportForm />
              </section>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SupportContact;
