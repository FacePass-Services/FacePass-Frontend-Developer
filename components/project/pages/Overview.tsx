import React from "react";
import { Button } from "@nextui-org/react";

import { IoIosInformationCircle } from "react-icons/io";
import { IoFilterOutline } from "react-icons/io5";
import Image from "next/image";

export default function Overview() {
  return (
    <section className="VStack w-full h-full  gap-4">
      <div className="grid grid-cols-4 gap-4 ">
        <div className="bg-white dark:bg-black gap-3 VStack shadow-sm rounded-lg p-3">
          <p className="opacity-75 text-xs">Sales</p>
          <div className="VStack">
            <p className="text-lg font-semibold">$6,678.86</p>
            <p className="opacity-75 text-sm">+2.3% than last month</p>
          </div>
        </div>
        <div className="bg-white dark:bg-black gap-3 VStack shadow-sm rounded-lg p-3">
          <p className="opacity-75 text-xs">Sales</p>
          <div className="VStack">
            <p className="text-lg font-semibold">$6,678.86</p>
            <p className="opacity-75 text-sm">+2.3% than last month</p>
          </div>
        </div>
        <div className="bg-white dark:bg-black gap-3 VStack shadow-sm rounded-lg p-3">
          <p className="opacity-75 text-xs">Sales</p>
          <div className="VStack">
            <p className="text-lg font-semibold">$6,678.86</p>
            <p className="opacity-75 text-sm">+2.3% than last month</p>
          </div>
        </div>
        <div className="bg-white dark:bg-black gap-3 VStack shadow-sm rounded-lg p-3">
          <p className="opacity-75 text-xs">Sales</p>
          <div className="VStack">
            <p className="text-lg font-semibold">$6,678.86</p>
            <p className="opacity-75 text-sm">+2.3% than last month</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-black gap-3 VStack shadow-sm rounded-lg p-3">
        <div className="VStack">
          <div className="HStack justify-between">
            <p className="font-semibold HStack items-center gap-2">
              Performance
              <span className=" opacity-70">
                <IoIosInformationCircle />
              </span>
            </p>
            <Button
              variant="bordered"
              className="HStack gap-3 border-gray-500 border-opacity-25"
            >
              <IoFilterOutline />
              <p>Filters</p>
            </Button>{" "}
          </div>
          <p className="text-xs opacity-70">Real time updates</p>
        </div>

        <p className="text-2xl font-semibold">$6,678.86</p>
        <div className=" w-full HStack items-start justify-start">
          <Image
            src="https://datavizproject.com/wp-content/uploads/types/Line-Graph.png"
            alt=""
            className="h-[400px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
