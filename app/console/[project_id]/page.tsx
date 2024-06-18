"use client";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Button, Checkbox } from "@nextui-org/react";
import { TiThSmall } from "react-icons/ti";
import { FaGear } from "react-icons/fa6";
import { GoChevronDown } from "react-icons/go";
import { IoLogoFlickr } from "react-icons/io";
import { LuChevronsUpDown } from "react-icons/lu";
import { BsChevronExpand } from "react-icons/bs";
import { IoCodeWorkingSharp } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import { BsChevronDown } from "react-icons/bs";
import { BsChevronUp } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
// import { columns, users } from "@/database/data";
import { MdEdit } from "react-icons/md";
import { IoTrashBinSharp } from "react-icons/io5";
import ProjectSettings from "@/components/project/ProjectSetting";

// dashboard
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  getKeyValue,
} from "@nextui-org/react";

const statusColorMap = {
  active: "success",
  deactive: "danger",
};
import ProjectBar from "@/components/project/ToolsBar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/react";
import { IoFolderOpenSharp } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { IoIosInformationCircle } from "react-icons/io";
import { IoFilterOutline } from "react-icons/io5";
import { User } from "@nextui-org/react";
import useToken from "@/hooks/useToken";

const users = [
  // Example user data
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    gender: "male",
    date_of_birth: "1990-01-01",
    phone_number: "+1234567890",
    role: "admin",
    // status: "active",
    team: "Team A",
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    gender: "female",
    date_of_birth: "1995-05-15",
    phone_number: "+9876543210",
    role: "user",
    // status: "inactive",
    team: "Team B",
  },
];

const columns = [
  { name: "First Name", uid: "first_name" },
  { name: "Last Name", uid: "last_name" },
  { name: "Email", uid: "email" },
  { name: "Gender", uid: "gender" },
  { name: "Date of Birth", uid: "date_of_birth" },
  { name: "Phone Number", uid: "phone_number" },
  // { name: "Role", uid: "role" },
  // { name: "Status", uid: "status" },
  { name: "Actions", uid: "actions" },
];

export default function Home({ params }: any) {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState("customers");
  const [showFilesContent, setShowFilesContent] = useState(false); // State to toggle visibility of Files content
  const [users, setUsers] = useState([]);
  const [projectEntire, setProjectEntire] = useState([]);

  const project_id = params.project_id.toString();
  const { username } = useToken();
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    if (!project_id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:5000/project/get_user_list?project_id=${project_id}`
        );
        if (res.status === 200) {
          setUsers(res.data.folder.users);
          setProjectEntire(res.data.folder);
        } else {
          console.error(`Error: Received status code ${res.status}`);
        }
      } catch (e: any) {
        console.error(
          "Fetching Error:",
          e.response ? e.response.data : e.message
        );
      }
    };
    setIsClient(true);
    fetchData();
  }, [project_id]);

  const handleItemClick = (item: any) => {
    if (item === "file") {
      // Toggle visibility of Files content
      setShowFilesContent(!showFilesContent);
    } else if (item === "a" || item === "b") {
      // Keep Files content open if 'a' or 'b' is clicked
      setSelectedItem(item); // Update the selected item
    } else {
      // For other items, just update the selected item
      setSelectedItem(item);
    }
  };

  //table

  const renderCell = React.useCallback((user: any, columnKey: any) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            {/* Assuming user has a team property */}
            <p className="text-bold text-sm capitalize text-default-400"></p>
          </div>
        );
      // case "status":
      //   return (
      //     <Chip
      //       className="capitalize"
      //       color={statusColorMap[0]}
      //       size="sm"
      //       variant="flat"
      //     >
      //       {cellValue}
      //     </Chip>
      //   );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                {/* Example using IoTrashBinSharp icon */}
                <IoTrashBinSharp />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <main className="VStack w-screen min-h-screen items-center">
      <ProjectBar projectEntire={projectEntire} />
      <div className="HStack w-full  h-full  pl-7 pr-7 ">
        <section
          id="Toolbar"
          className="VStack min-h-[90vh] w-2/12 h-full justify-between max-w-[300px] pl-2 pr-2"
        >
          <div className="VStack w-full">
            {/* <Dropdown>
              <DropdownTrigger>
                <div className="HStack cursor-pointer justify-between items-center h-20">
                  <div className="HStack gap-3 items-center">
                    <div className="HStack gap-1">
                      <MdWork className="text-xl" />
                      <p className="font-semibold text-[16px]">Project 1</p>
                    </div>
                    <BsChevronExpand className="font-bold text-md" />
                  </div>
                </div>
              </DropdownTrigger>
              <DropdownMenu
                variant="faded"
                aria-label="Dropdown menu with description"
              >
                <DropdownSection title="Projects" showDivider>
                  <DropdownItem
                    key="new"
                    shortcut="⌘N"
                    description="Create a new file"
                    // startContent={<AddNoteIcon className={iconClasses} />}
                  >
                    New file
                  </DropdownItem>
                  <DropdownItem
                    key="copy"
                    shortcut="⌘C"
                    description="Copy the file link"
                    // startContent={<CopyDocumentIcon className={iconClasses} />}
                  >
                    Copy link
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    shortcut="⌘⇧E"
                    description="Allows you to edit the file"
                    // startContent={<EditDocumentIcon className={iconClasses} />}
                  >
                    Edit file
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Quick actions">
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    shortcut="⌘⇧D"
                    description="Permanently delete the file"
                    // startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
                  >
                    Setting
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown> */}

            <div className="w-full h-1 mb-3 "></div>
            <section className="VStack gap-7 text-[12px]">
              <ul className="VStack gap-2  ">
                <li
                  className={`HStack justify-between cursor-pointer rounded-lg pl-6 pr-6 pb-3 pt-3 ${
                    selectedItem === "dashboard"
                      ? "bg-white dark:bg-black font-semibold  shadow-sm"
                      : ""
                  }`}
                  onClick={() => handleItemClick("dashboard")}
                >
                  <div className="HStack gap-2 items-center">
                    <TiThSmall className="text-xl" />

                    <p>Dashboard</p>
                  </div>
                  <p></p>
                </li>
              </ul>
              <ul className="VStack gap-2 ">
                <li
                  className={`HStack justify-between cursor-pointer rounded-lg pl-6 pr-6 pb-3 pt-3 ${
                    selectedItem === "products"
                      ? "bg-white dark:bg-black font-semibold  shadow-sm"
                      : ""
                  }`}
                  onClick={() => handleItemClick("products")}
                >
                  <div className="HStack gap-2 items-center">
                    <IoFolderOpenSharp className="w-5 h-5 aspect-square" />
                    <p>Products</p>
                  </div>
                  <p></p>
                </li>
                <li
                  className={`HStack justify-between cursor-pointer rounded-lg pl-6 pr-6 pb-3 pt-3 ${
                    selectedItem === "customers"
                      ? "bg-white dark:bg-black font-semibold  shadow-sm"
                      : ""
                  }`}
                  onClick={() => handleItemClick("customers")}
                >
                  <div className="HStack gap-2 items-center">
                    <FaCircleUser className="text-xl" />
                    <p>Users</p>
                  </div>
                  <p></p>
                </li>
                <li
                  className={`HStack justify-between cursor-pointer rounded-lg pl-6 pr-6 pb-3 pt-3 ${
                    selectedItem === "orders"
                      ? "bg-white dark:bg-black font-semibold  shadow-sm"
                      : ""
                  }`}
                  onClick={() => handleItemClick("orders")}
                >
                  <div className="HStack gap-2 items-center">
                    <IoFolderOpenSharp className="w-5 h-5 aspect-square" />
                    <p>Orders</p>
                  </div>
                  <p>1</p>
                </li>
                <li
                  className={`HStack justify-between cursor-pointer rounded-lg pl-6 pr-6 pb-3 pt-3 ${
                    selectedItem === "secret"
                      ? "bg-white dark:bg-black font-semibold  shadow-sm"
                      : ""
                  }`}
                  onClick={() => handleItemClick("secret")}
                >
                  <div className="HStack gap-2 items-center">
                    <IoFolderOpenSharp className="w-5 h-5 aspect-square" />
                    <p>Secret</p>
                  </div>
                  <p></p>
                </li>
              </ul>
              <section
                className={`VStack justify-between items-center cursor-pointer `}
              >
                <div
                  className={`HStack justify-between w-full pt-3 pb-3 items-center  ${
                    selectedItem === "file" ? "" : ""
                  }`}
                  onClick={() => handleItemClick("file")}
                >
                  <p>Files</p>
                  {showFilesContent ? <BsChevronUp /> : <BsChevronDown />}
                </div>

                {showFilesContent && (
                  <ul className={`VStack gap-2 w-full`}>
                    <li
                      className={`HStack justify-between cursor-pointer rounded-lg pl-6 pr-6 pb-3 pt-3 ${
                        selectedItem === "a"
                          ? "bg-white dark:bg-black font-semibold  shadow-sm"
                          : ""
                      }`}
                      onClick={() => handleItemClick("a")}
                    >
                      <div className="HStack gap-2 items-center">
                        <IoFolderOpenSharp className="w-5 h-5 aspect-square" />
                        <p>A</p>
                      </div>
                      <p></p>
                    </li>
                    <li
                      className={`HStack justify-between cursor-pointer rounded-lg pl-6 pr-6 pb-3 pt-3 ${
                        selectedItem === "b"
                          ? "bg-white dark:bg-black font-semibold  shadow-sm"
                          : ""
                      }`}
                      onClick={() => handleItemClick("b")}
                    >
                      <div className="HStack gap-2 items-center">
                        <IoFolderOpenSharp className="w-5 h-5 aspect-square" />
                        <p>B</p>
                      </div>
                      <p></p>
                    </li>
                    {/* Add other file items here */}
                  </ul>
                )}
              </section>
            </section>
          </div>
          <div className="VStack gap-7 text-[12px]">
            <ul className={`VStack gap-2 w-full`}>
              <li
                className={`HStack justify-between cursor-pointer rounded-lg pl-6 pr-6 pb-3 pt-3 ${
                  selectedItem === "setting"
                    ? "bg-white dark:bg-black font-semibold  shadow-sm"
                    : ""
                }`}
                onClick={() => handleItemClick("setting")}
              >
                <div className="HStack gap-2 items-center">
                  <IoMdSettings className="w-5 h-5 aspect-square" />
                  <p>Setting</p>
                </div>
                <p></p>
              </li>

              {/* Add other file items here */}
            </ul>{" "}
          </div>
        </section>
        <section id="Stage" className="pl-5 mt-5 w-10/12 VStack ">
          {selectedItem && (
            <div>
              {/* Render content based on the selected item */}
              {selectedItem === "dashboard" && (
                <section className="VStack w-full h-full  gap-4">
                  <div className="grid grid-cols-4 gap-4 ">
                    <div className="bg-white dark:bg-black gap-3 VStack shadow-sm rounded-lg p-3">
                      <p className="opacity-75 text-xs">Sales</p>
                      <div className="VStack">
                        <p className="text-lg font-semibold">$6,678.86</p>
                        <p className="opacity-75 text-sm">
                          +2.3% than last month
                        </p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-black gap-3 VStack shadow-sm rounded-lg p-3">
                      <p className="opacity-75 text-xs">Sales</p>
                      <div className="VStack">
                        <p className="text-lg font-semibold">$6,678.86</p>
                        <p className="opacity-75 text-sm">
                          +2.3% than last month
                        </p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-black gap-3 VStack shadow-sm rounded-lg p-3">
                      <p className="opacity-75 text-xs">Sales</p>
                      <div className="VStack">
                        <p className="text-lg font-semibold">$6,678.86</p>
                        <p className="opacity-75 text-sm">
                          +2.3% than last month
                        </p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-black gap-3 VStack shadow-sm rounded-lg p-3">
                      <p className="opacity-75 text-xs">Sales</p>
                      <div className="VStack">
                        <p className="text-lg font-semibold">$6,678.86</p>
                        <p className="opacity-75 text-sm">
                          +2.3% than last month
                        </p>
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
                      <img
                        src="https://datavizproject.com/wp-content/uploads/types/Line-Graph.png"
                        alt=""
                        className="h-[400px] object-contain"
                      />
                    </div>
                  </div>
                </section>
              )}
              {selectedItem === "products" && <p>Products Content</p>}
              {selectedItem === "customers" && (
                <>
                  <div className="w-full h-32">
                    <div className="HStack w-full h-full justify-between">
                      <div className="VStack gap-4">
                        <h2 className="text-3xl font-semibold">Users</h2>
                        <p className="text-lg">
                          Customers lorem ipsum dolor sit amet, consectetur
                          adipiscing elit, sed do eiusmod tempor incididunt ut
                          labore et dolore magna aliqua.
                        </p>
                      </div>
                      <div>
                        <Button>New Customers</Button>
                      </div>
                    </div>
                  </div>

                  <section className="VSatck w-full">
                    <div className="w-full HStack gap-5 items-center justify-end mb-5">
                      <Input
                        type="text"
                        variant="bordered"
                        size="sm"
                        label="Search"
                      />

                      {/* <Dropdown>
                        <DropdownTrigger> */}
                          <Button>
                            <IoFilterOutline />
                            <p>Filters</p>
                          </Button>{" "}
                        {/* </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Action event example"
                        >
                          <DropdownItem key="new212">New file</DropdownItem>
                          <DropdownItem key="co321py">Copy link</DropdownItem>
                          <DropdownItem key="ed342it">Edit file</DropdownItem>
                          <DropdownItem
                            key="del123123ete"
                            className="text-danger"
                            color="danger"
                          >
                            Delete file
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown> */}
                    </div>
                    <Table className="" aria-label="User Table">
                      <TableHeader columns={columns}>
                        {(column) => (
                          <TableColumn
                            key={column.uid}
                            align={
                              column.uid === "actions" ? "center" : "start"
                            }
                          >
                            {column.name}
                          </TableColumn>
                        )}
                      </TableHeader>
                      <TableBody items={users}>
                        {(item) => (
                          <TableRow key={item.id}>
                            {(columnKey) => (
                              <TableCell>
                                {renderCell(item, columnKey)}
                              </TableCell>
                            )}
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </section>
                </>
              )}
              {selectedItem === "orders" && <p>Orders Content</p>}
              {selectedItem === "secret" && <p>Secret Content</p>}
              {selectedItem === "a" && <p>a Content</p>}
              {selectedItem === "b" && <p>b Content</p>}
              {selectedItem === "setting" && (
                <ProjectSettings project={projectEntire} />
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
