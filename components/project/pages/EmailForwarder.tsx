import React, { useEffect, useState } from "react";
import { IoIosInformationCircle } from "react-icons/io";
import { IoFilterOutline } from "react-icons/io5";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { IoCheckmark } from "react-icons/io5";
import { Button, Input, TimeInput, DatePicker } from "@nextui-org/react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import {Textarea} from "@nextui-org/input";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";

// Register the required components
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale
);

export default function Overview({ projectID }: any) {
  const [loginTotal, setLoginTotal] = useState<number>(0);
  const [loginToday, setLoginToday] = useState<number>(0);
  const [loginYesterday, setLoginYesterday] = useState<number>(0);
  const [loginThisMonth, setLoginThisMonth] = useState<number>(0);
  const [loginLastMonth, setLoginLastMonth] = useState<number>(0);
  const [loginThisYear, setLoginThisYear] = useState<number>(0);
  const [loginLastYear, setLoginLastYear] = useState<number>(0);

  const [loginByDay, setLoginByDay] = useState<any>({});
  const [loginByMonth, setLoginByMonth] = useState<any>({});
  const [loginByYear, setLoginByYear] = useState<any>({});
  const [selectedFilter, setSelectedFilter] = useState<string>("Year"); // New state for filter

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
                <div className="HStack w-full gap-10 items-center">
                  <div className="w-1/12">
                    <p>To</p>
                  </div>
                  <div className="w-11/12">
                    {" "}
                    {/* <input placeholder="email" className="w-full" /> */}
                    <Select
                      placeholder="email"
                      className="w-full"
                    >
                      <SelectItem key={"hi"}>1</SelectItem>
                      <SelectItem key={"hi"}>2</SelectItem>

                      <SelectItem key={"hi"}>3</SelectItem>
                      <SelectItem key={"hi"}>4</SelectItem>

                    </Select>
                  </div>
                </div>
              </li>
              <li className="HStack w-full justify-between cursor-pointer pl-5 pr-5 pb-3 pt-3">
                <div className="HStack w-full gap-10 items-center">
                  <div className="w-1/12">
                    <p>Subject</p>
                  </div>
                  <div className="w-11/12">
                    {" "}
                    <Input placeholder="subject" className="w-full" />
                  </div>
                </div>
              </li>
              <li className="VStack w-full gap-3 justify-between cursor-pointer pl-5 pr-5 pb-3 pt-3">
                <div className="VStack w-full gap-5 items-start">
                <p>Body</p>

                <Textarea
      // label="Body"
      placeholder="Enter your body"
      className="w-full"
    />
                </div>
                <div className="HStack justify-end gap-3 mb-2">
                  {" "}
                  <Button className="w-fit min-w-[150px] bg-primary-dark text-white">
                    Send
                  </Button>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </section>
    </section>
  );
}
