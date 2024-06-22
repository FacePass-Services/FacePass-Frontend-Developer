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
import ProjectSettings from "@/components/project/pages/settings";
import Overview from "@/components/project/pages/overview";
import UserList from "@/components/project/pages/userlist"
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



const columns = [
  { name: "First Name", uid: "first_name" },
  { name: "Last Name", uid: "last_name" },
  { name: "Email", uid: "email" },
  { name: "Gender", uid: "gender" },
  { name: "Date of Birth", uid: "date_of_birth" },
  { name: "Phone Number", uid: "phone_number" },

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

                    <p>OverView</p>
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
                  <p>Advances</p>
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
                  <p>Settings</p>
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
              {selectedItem === "dashboard" && <Overview />}
              {selectedItem === "products" && <p>Products Content</p>}
              {selectedItem === "customers" && (
              <UserList project_id={project_id} users={users} />
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
