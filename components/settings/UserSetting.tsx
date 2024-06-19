import React, { useState, useEffect } from "react";
import { Input, Button, Image, Link } from "@nextui-org/react";
import { GoChevronRight } from "react-icons/go";
import { CiEdit } from "react-icons/ci";
import { MdDownloadDone } from "react-icons/md";
import { IoLockClosed } from "react-icons/io5";
import useToken from "@/hooks/useToken";
import { Chip } from "@nextui-org/react";

const UserSetting = () => {
  const {
    username,
    role,
    firstName,
    lastName,
    email,
    gender,
    dateOfBirth,
    phoneNumber,
    setToken,
  } = useToken();

  const [editedFirstName, setEditedFirstName] = useState(firstName);
  const [editedLastName, setEditedLastName] = useState(lastName);
  const [editedDOB, setEditedDOB] = useState(dateOfBirth);
  const [editedGender, setEditedGender] = useState(gender);
  const [editedPhone, setEditedPhone] = useState(phoneNumber);
  const [editedEmail, setEditedEmail] = useState(email);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditedFirstName(firstName);
    setEditedLastName(lastName);
    setEditedDOB(dateOfBirth);
    setEditedGender(gender);
    setEditedPhone(phoneNumber);
    setEditedEmail(email);
  }, [firstName, lastName, dateOfBirth, gender, phoneNumber, email]);
  console.log(role);

  const profileImg =
    "https://static.vecteezy.com/system/resources/thumbnails/018/742/015/small_2x/minimal-profile-account-symbol-user-interface-theme-3d-icon-rendering-illustration-isolated-in-transparent-background-png.png";

  const handleEditMode = () => {
    setIsEditing(true);
  };

  const updateCancel = () => {
    setIsEditing(false);
  };

  const updateUser = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/user/update_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          first_name: editedFirstName,
          last_name: editedLastName,
          // Add other fields to update here as needed
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsEditing(false);
        console.log("User updated successfully!", data);

        // Update local storage and state using saveToken
        setToken(data);

        // Optionally update the state variables directly if necessary
        setEditedFirstName(data.user.first_name);
        setEditedLastName(data.user.last_name);
        setEditedDOB(data.user.date_of_birth);
        setEditedGender(data.user.gender);
        setEditedPhone(data.user.phone_number);
        setEditedEmail(data.user.email);
        window.location.reload();
      } else {
        console.error("Error updating user:", data.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <section className="w-full h-full gap-5 items-center VStack">
      {/* User information display */}
      <div className="VStack justify-center items-center">
        <Image className="w-32 h-32" src={profileImg} alt="User Avatar" />
        <p className="text-lg font-medium">{username}</p>
        {role === "user" && (
          <p className="text-base opacity-75">FacePass Account</p>
        )}
        {(role === "dev_plus" || role === "dev_pro" || role === "dev_lite") && (
          <p className="text-base opacity-75">Developer Account</p>
        )}

        {role === "dev_lite" && (
          <>
          <Chip
              variant="shadow"
              classNames={{
                base: " bg-gradient-to-l from-teal-400 to-yellow-200 border-small border-white/50 shadow-pink-500/30",
                content: "drop-shadow shadow-black text-white",
              }}
            >
              {" "}
              Lite
            </Chip>
          </>
        )}
        {role === "dev_plus" && (
          <>
          <Chip
              variant="shadow"
              classNames={{
                base: "bg-gradient-to-r from-amber-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                content: "drop-shadow shadow-black text-white",
              }}
            >
              {" "}
              Plus
            </Chip>
          </>
        )}
        {role === "dev_pro" && (
          <>
            <Chip
              variant="shadow"
              classNames={{
                base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                content: "drop-shadow shadow-black text-white",
              }}
            >
              {" "}
              Pro
            </Chip>
          </>
        )}
      </div>

      {/* Input fields for editing user information */}
      <section
        id="Toolbar"
        className="VStack md:w-8/12 w-full justify-between pl-2 pr-2"
      >
        <div className="VStack w-full">
          <section className="VStack gap-7 text-sm">
            {isEditing ? (
              <>
                <div className="HStack items-center  w-full justify-between">
                  <Link
                    onClick={updateCancel}
                    className=" cursor-pointer text-blue-500   HStack"
                  >
                    {" "}
                    Cancel
                  </Link>
                  <Button
                    onClick={updateUser}
                    className="gap-3 items-center text-black dark:text-white bg-primary dark:bg-primary-dark HStack"
                  >
                    {" "}
                    <MdDownloadDone />
                    Done
                  </Button>
                </div>
              </>
            ) : (
              <div className="HStack  w-full justify-end">
                <Button
                  onClick={handleEditMode}
                  className="gap-3 text-black dark:text-white bg-primary dark:bg-primary-dark HStack"
                >
                  {" "}
                  <CiEdit />
                  Edit
                </Button>
              </div>
            )}

            {/* First name input section */}
            <ul className="VStack divide-y dark:divide-gray-800 dark:bg-primary-dark bg-primary rounded-lg">
              <li className="HStack w-full justify-between cursor-pointer pl-5 pr-5 pb-3 pt-3">
                <div className="HStack w-full justify-between items-center">
                  <p>First Name</p>
                  <div className="gap-1 HStack opacity-75 items-center">
                    {isEditing ? (
                      <Input
                        type="text"
                        value={editedFirstName}
                        onChange={(e) => setEditedFirstName(e.target.value)}
                      />
                    ) : (
                      <>
                        <p>{firstName}</p>
                        <GoChevronRight className="font-normal text-base" />
                      </>
                    )}
                  </div>
                </div>
              </li>
              <li className="HStack w-full justify-between cursor-pointer pl-5 pr-5 pb-3 pt-3">
                <div className="HStack w-full justify-between items-center">
                  <p>Last Name</p>
                  <div className="gap-1 HStack opacity-75 items-center">
                    {isEditing ? (
                      <Input
                        type="text"
                        value={editedLastName}
                        onChange={(e) => setEditedLastName(e.target.value)}
                      />
                    ) : (
                      <>
                        <p>{lastName}</p>
                        <GoChevronRight className="font-normal text-base" />
                      </>
                    )}
                  </div>
                </div>
              </li>
            </ul>
            <div className="VStack w-full">
              <ul className="VStack dark:bg-primary-dark bg-primary rounded-lg">
                <li className="HStack w-full justify-between cursor-pointer rounded-lg pl-5 pr-5 pb-3 pt-3">
                  <div className="HStack w-full justify-between items-center">
                    <p>Date of Birth</p>
                    <div className="gap-1 HStack opacity-75">
                      {isEditing ? (
                        <div className="HStack opacity-25 items-center gap-1">
                          {" "}
                          <p className="">{dateOfBirth}</p>
                          <IoLockClosed />
                        </div>
                      ) : (
                        <div className="HStack gap-1 items-center">
                          <p className="">{dateOfBirth}</p>
                          <GoChevronRight className="font-normal text-base" />
                        </div>
                      )}
                    </div>
                  </div>
                </li>
                <li className="HStack w-full justify-between cursor-pointer rounded-lg pl-5 pr-5 pb-3 pt-3">
                  <div className="HStack w-full justify-between items-center">
                    <p>Gender</p>
                    <div className="gap-1 HStack opacity-75">
                      {isEditing ? (
                        <div className="HStack opacity-25 items-center gap-1">
                          {" "}
                          <p className="">
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                          </p>
                          <IoLockClosed />
                        </div>
                      ) : (
                        <div className="HStack gap-1 items-center">
                          <p className="">
                            {" "}
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                          </p>
                          <GoChevronRight className="font-normal text-base" />
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              </ul>
              {isEditing && (
                <p className="pt-2 opacity-25 text-xs pl-2">
                  According to TF3949 Information cannot be change in 1.0 Beta
                  1b
                </p>
              )}
            </div>
            <div className="w-full">
              <ul className="VStack dark:bg-primary-dark bg-primary rounded-lg">
                <li className="HStack w-full justify-between cursor-pointer rounded-lg pl-5 pr-5 pb-3 pt-3">
                  <div className="HStack w-full justify-between items-center">
                    <p>Phone Number</p>
                    <div className="gap-1 HStack opacity-75 items-center">
                      {isEditing ? (
                        <div className="HStack opacity-25 items-center gap-1">
                          {" "}
                          <p className="">{phoneNumber}</p>
                          <IoLockClosed />
                        </div>
                      ) : (
                        <>
                          <p>{phoneNumber}</p>
                          <GoChevronRight className="font-normal text-base" />
                        </>
                      )}
                    </div>
                  </div>
                </li>
                <li className="HStack w-full justify-between cursor-pointer rounded-lg pl-5 pr-5 pb-3 pt-3">
                  <div className="HStack w-full justify-between items-center">
                    <p>Email Address</p>
                    <div className="gap-1 HStack opacity-75 items-center">
                      {isEditing ? (
                        <div className="HStack opacity-25 items-center gap-1">
                          {" "}
                          <p className="">{email}</p>
                          <IoLockClosed />
                        </div>
                      ) : (
                        <>
                          <p>{email}</p>
                          <GoChevronRight className="font-normal text-base" />
                        </>
                      )}
                    </div>
                  </div>
                </li>
              </ul>
              {isEditing && (
                <p className="pt-2 opacity-25 text-xs pl-2">
                  According to TF3949 Information cannot be change in 1.0 Beta
                  1b
                </p>
              )}
            </div>
          </section>
        </div>
      </section>
    </section>
  );
};

export default UserSetting;
