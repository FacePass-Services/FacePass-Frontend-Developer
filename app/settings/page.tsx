"use client";
import React, { useState, useEffect } from "react";
import Toolbar from "@/components/settings/SettingToolsBar";
import UserSetting from "@/components/settings/UserSetting";
import NotificationSetting from "@/components/settings/NotificationSetting";
import SoundSetting from "@/components/settings/SoundSetting";
import GeneralSetting from "@/components/settings/GeneralSetting";
import PrivacySetting from "@/components/settings/PrivacySetting";
import AccessibilitySetting from "@/components/settings/AccessibilitySetting";
import ControlSetting from "@/components/settings/ContolCenterSetting";
import { Link } from "@nextui-org/react";
import { GoChevronLeft } from "react-icons/go";
import Subscriptions from "@/components/settings/SubscriptionsSetting";
export default function App() {
  const [selectedItem, setSelectedItem] = useState("user");
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
  };

  const handleBackClick = () => {
    if (isMobile) {
      setSelectedItem(""); // Set selectedItem to empty string for mobile
    } else {
      setSelectedItem("user"); // Set selectedItem to 'user' for desktop
    }
  };

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSelectedItem(""); // Set selectedItem to empty string for mobile
      } else {
        setSelectedItem("user"); // Set selectedItem to 'user' for desktop
      }
    }

    // This check ensures this code will only execute in the client-side.
    if (typeof window !== "undefined") {
      handleResize(); // Call this function initially to update the state.
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // Don't render anything until `isMobile` state is determined
  if (isMobile === null) {
    return null;
  }

  return (
    <main className="xl:pl-10 bg-secondary dark:bg-secondary-dark xl:pr-10 VStack min-h-screen overflow-y-hidden w-full items-center">
      {selectedItem && isMobile ? (
        <div
          className=" fixed pl-7 pt-1  left-0 HStack items-center  text-blue-500 gap-1 text-base font-normal cursor-pointer"
          onClick={handleBackClick}
        >
          <GoChevronLeft />
          <p>Settings</p>
        </div>
      ) : (
        <Link
          href="/"
          className=" fixed pl-7 pt-1  left-0 HStack items-center  text-blue-500 gap-1 text-base font-normal cursor-pointer"
        >
          <GoChevronLeft />
          <p>Home</p>
        </Link>
      )}
      <div className="HStack items-center justify-center text-center w-full pl-7 pr-7 pt-1">
        <p className="text-2xl  md:pl-0 w-full font-medium">
          {selectedItem
            ? selectedItem.charAt(0).toUpperCase() + selectedItem.slice(1)
            : "Settings"}
        </p>{" "}
      </div>

      <div className="HStack justify-center w-full h-full pt-5 pb-5 pl-7 pr-7">
        <div
          className={`${
            isMobile && selectedItem !== ""
              ? "hidden"
              : "VStack  w-full md:max-w-[300px] "
          }`}
        >
          <Toolbar
            selectedItem={selectedItem}
            handleItemClick={handleItemClick}
          />
        </div>

        <section
          className={`${
            isMobile && selectedItem === "" ? "hidden" : "VStack w-full pl-5"
          }`}
        >
          {/* {isMobile && selectedItem !== "" && (
            <Link
              className="HStack absolute text-blue-500  gap-1 text-base font-normal cursor-pointer"
              onClick={handleBackClick}
            >
              <GoChevronLeft />
              <p>Settings</p>
            </Link>
          )} */}
          {selectedItem === "user" && <UserSetting />}
          {selectedItem === "notification" && <NotificationSetting />}
          {selectedItem === "sound" && <SoundSetting />}
          {selectedItem === "general" && <GeneralSetting />}
          {selectedItem === "control" && <ControlSetting />}
          {selectedItem === "accessibility" && <AccessibilitySetting />}
          {selectedItem === "privacy" && <PrivacySetting />}
          {selectedItem === "subscriptions" && <Subscriptions />}

        </section>
      </div>
    </main>
  );
}
