import React, { useEffect, useState } from "react";
import { IoIosInformationCircle } from "react-icons/io";
import { IoFilterOutline } from "react-icons/io5";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { IoCheckmark } from "react-icons/io5";
import { Button, Input, TimeInput, DatePicker } from "@nextui-org/react";

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

  useEffect(() => {
    const fetchLoginTotal = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/statistic/login_total`,
          {
            params: { project_id: projectID },
          }
        );
        const data = response.data;
        setLoginTotal(data.total_logs);
      } catch (error) {
        console.error("Error fetching login total:", error);
      }
    };

    const fetchLoginToday = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/statistic/login_today`,
          {
            params: { project_id: projectID },
          }
        );
        const data = response.data;
        console.log("Login today data:", data); // Log raw response
        setLoginToday(data.total_logs_today);
        console.log("Login today value:", data.total_logs_today); // Log the value set to state
      } catch (error) {
        console.error("Error fetching login today:", error);
      }
    };

    const fetchLoginYesterday = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/statistic/login_yesterday`,
          {
            params: { project_id: projectID },
          }
        );
        const data = response.data;
        console.log("Login yesterday data:", data); // Log raw response
        setLoginYesterday(data.total_logs_yesterday);
        console.log("Login yesterday value:", data.total_logs_yesterday); // Log the value set to state
      } catch (error) {
        console.error("Error fetching login yesterday:", error);
      }
    };

    const fetchLoginThisMonth = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/statistic/login_this_month`,
          {
            params: { project_id: projectID },
          }
        );
        const data = response.data;
        setLoginThisMonth(data.total_logs_this_month);
      } catch (error) {
        console.error("Error fetching login this month:", error);
      }
    };

    const fetchLoginLastMonth = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/statistic/login_last_month`,
          {
            params: { project_id: projectID },
          }
        );
        const data = response.data;
        setLoginLastMonth(data.total_logs_last_month);
      } catch (error) {
        console.error("Error fetching login this month:", error);
      }
    };

    const fetchLoginThisYear = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/statistic/login_this_year`,
          {
            params: { project_id: projectID },
          }
        );
        const data = response.data;
        setLoginThisYear(data.total_logs_this_year);
      } catch (error) {
        console.error("Error fetching login this year:", error);
      }
    };

    const fetchLoginLastYear = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/statistic/login_last_year`,
          {
            params: { project_id: projectID },
          }
        );
        const data = response.data;
        setLoginLastYear(data.total_logs_this_year);
      } catch (error) {
        console.error("Error fetching login this year:", error);
      }
    };
    // ==============================Filters==========================
    const fetchLoginByDay = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/statistic/login_by_day`,
          {
            params: {
              project_id: projectID,
              // year: new Date().getFullYear(),
              // month: new Date().getMonth() + 1,
              // day: new Date().getDate(),
            },
          }
        );
        setLoginByDay(response.data);
      } catch (error) {
        console.error("Error fetching login by day:", error);
      }
    };

    const fetchLoginByMonth = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/statistic/login_by_this_month`,
          {
            params: { project_id: projectID },
          }
        );
        setLoginByMonth(response.data);
      } catch (error) {
        console.error("Error fetching login by month:", error);
      }
    };
    const fetchLoginByYear = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/statistic/login_by_this_year`,
          {
            params: { project_id: projectID },
          }
        );
        setLoginByYear(response.data);
      } catch (error) {
        console.error("Error fetching login by year:", error);
      }
    };
    fetchLoginByDay();
    fetchLoginByMonth();
    fetchLoginLastYear();
    fetchLoginByYear();
    fetchLoginLastMonth();
    fetchLoginThisYear();
    fetchLoginThisMonth();
    fetchLoginToday();
    fetchLoginYesterday();
    fetchLoginTotal();
  }, [projectID]);

  const handleFilterSelect = (key: string) => {
    setSelectedFilter(key);
  };

  return (
    <section className="VStack w-full h-full gap-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-black gap-3 VStack shadow-sm rounded-lg p-3">
          <p className="opacity-75 text-xs">Total</p>
          <div className="VStack">
            <p className="text-lg font-semibold">{loginTotal}</p>{" "}
            {/* Display the total login count */}
            <p className="opacity-75 text-sm">+2.3% than last month</p>
          </div>
        </div>
        <div className="bg-white dark:bg-black gap-3 VStack shadow-sm rounded-lg p-3">
          <p className="opacity-75 text-xs">Today</p>
          <div className="VStack">
            <p className="text-lg font-semibold">{loginToday}</p>
            {loginYesterday > 0 ? (
              <p className="opacity-75 text-sm">
                {loginToday > loginYesterday ? "+" : ""}
                {(
                  ((loginToday - loginYesterday) / loginYesterday) *
                  100
                ).toFixed(2)}
                % than yesterday
              </p>
            ) : (
              <p className="opacity-75 text-sm">
                No data available for yesterday
              </p>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-black gap-3 VStack shadow-sm rounded-lg p-3">
          <p className="opacity-75 text-xs">This Month</p>
          <div className="VStack">
            <p className="text-lg font-semibold">{loginThisMonth}</p>
            {loginLastMonth > 0 ? (
              <p className="opacity-75 text-sm">
                {loginThisMonth > loginLastMonth ? "+" : ""}
                {(
                  ((loginThisMonth - loginLastMonth) / loginLastMonth) *
                  100
                ).toFixed(2)}
                % than month
              </p>
            ) : (
              <p className="opacity-75 text-sm">
                No data available for yesterday
              </p>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-black gap-3 VStack shadow-sm rounded-lg p-3">
          <p className="opacity-75 text-xs">This Year</p>
          <div className="VStack">
            <p className="text-lg font-semibold">{loginThisYear}</p>
            {loginLastYear > 0 ? (
              <p className="opacity-75 text-sm">
                {loginThisYear > loginLastYear ? "+" : ""}
                {(
                  ((loginThisYear - loginLastYear) / loginLastYear) *
                  100
                ).toFixed(2)}
                % than year
              </p>
            ) : (
              <p className="opacity-75 text-sm">
                No data available for last year
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-black gap-3 VStack shadow-sm rounded-lg p-3">
        <div className="VStack">
          <div className="HStack justify-between">
            {/* Display the selected filter */}
            <p className="font-semibold HStack items-center gap-2">
              {selectedFilter}
              <span className="opacity-70">
                <IoIosInformationCircle />
              </span>
            </p>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="HStack gap-3 border-gray-500 border-opacity-25"
                >
                  <IoFilterOutline />
                  <p>Filters</p>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Action event example"
                onAction={(key) => handleFilterSelect(key as string)}
              >
                <DropdownItem key="Today">
                  <div className="w-full justify-between items-center HStack">
                    Today {selectedFilter === "Today" && <IoCheckmark />}
                  </div>
                </DropdownItem>
                <DropdownItem key="Month">
                  <div className="w-full justify-between items-center HStack">
                    Month {selectedFilter === "Month" && <IoCheckmark />}
                  </div>
                </DropdownItem>
                <DropdownItem key="Year">
                  <div className="w-full justify-between items-center HStack">
                    Year {selectedFilter === "Year" && <IoCheckmark />}
                  </div>
                </DropdownItem>
                <DropdownItem key="Advance">
                  <div className="w-full justify-between items-center HStack">
                    <div className="HStack gap-2 items-center">
                      {" "}
                      Advance <sup>Beta</sup>
                    </div>
                    {selectedFilter === "Advance" && <IoCheckmark />}
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <p className="text-xs opacity-70">Real-time updates</p>
        </div>
        {/* Line chart */}
        {selectedFilter === "Today" && (
          <Line
            data={{
              labels: Object.keys(loginByDay),
              datasets: [
                {
                  label: "Logins by Hour",
                  data: Object.values(loginByDay).slice(0, -1), // exclude the "total_logs" key
                  fill: false,
                  borderColor: "rgba(75, 192, 192, 1)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  tension: 0.1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        )}
        {selectedFilter === "Month" && (
          <Line
            data={{
              labels: Object.keys(loginByMonth),
              datasets: [
                {
                  label: "Logins by Month",
                  data: Object.values(loginByMonth),
                  fill: false,
                  borderColor: "rgba(75, 192, 192, 1)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  tension: 0.1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        )}
        {selectedFilter === "Year" && (
          <Line
            data={{
              labels: Object.keys(loginByYear),
              datasets: [
                {
                  label: "Logins by Year",
                  data: Object.values(loginByYear),
                  fill: false,
                  borderColor: "rgba(75, 192, 192, 1)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  tension: 0.1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        )}

        {selectedFilter === "Advance" && (
          <>
            <section className="VStack gap-5">
              <section className="HStack w-full gap-5 items-center">
                <div className="HStack gap-3 items-center">
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <DatePicker
                      label="Start Date"
                      isRequired
                      className="max-w-[284px] min-w-[200px]"
                    />
                  </div>
                  <TimeInput
                    isRequired
                    label="Time (UTC)"
                    className="max-w-[284px] min-w-[200px]"
                  />
                </div>
                <p>to</p>

                <div className="HStack gap-3 items-center">
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <DatePicker
                      label="End Date"
                      className="max-w-[284px] min-w-[200px]"
                      isRequired
                    />
                  </div>
                  <TimeInput
                    isRequired
                    label="Time (UTC)"
                    className="max-w-[284px] min-w-[200px]"
                  />
                </div>
              </section>
              <div className="HStack gap-3">
                {" "}
                <Button className="w-fit bg-primary-dark text-white">
                  Search
                </Button>
                <Button className="w-fit  ">Clear</Button>
              </div>
            </section>
          </>
        )}
      </div>
    </section>
  );
}
