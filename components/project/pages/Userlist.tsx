import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import { IoFilterOutline } from "react-icons/io5";
import { IoTrashBinSharp } from "react-icons/io5";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  last_login: string;
  phone_number: string;
}

interface Props {
  users: User[];
  project_id: number;
}

const columns = [
  { name: "First Name", uid: "first_name" },
  { name: "Last Name", uid: "last_name" },
  { name: "Email", uid: "email" },
  { name: "Gender", uid: "gender" },
  // { name: "Date of Birth", uid: "date_of_birth" },
  // { name: "Phone Number", uid: "phone_number" },
  { name: 'Last Login', uid: 'last_login'},
  { name: "Actions", uid: "actions" },
];

const UserList: React.FC<Props> = ({ users, project_id }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [usersList, setUsersList] = useState<User[]>(users);

  useEffect(() => {
    setUsersList(users);
  }, [users]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setLoading(true);

    if (query === "") {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${BACKEND_URL}/project/search_user_list?project_id=${project_id}&search=${query}`
      );
      setSearchResults(response.data.users);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId: number) => {
    try {
      await axios.delete(`${BACKEND_URL}/project/remove_user`, {
        data: { project_id: project_id, user_id: userId },
      });

      const updatedUsersList = usersList.filter((user) => user.id !== userId);
      setUsersList(updatedUsersList);
      console.log("User removed successfully");
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const renderCell = (user: User, columnKey: string) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span
              className="text-lg text-danger cursor-pointer active:opacity-50"
              onClick={() => {
                setSelectedUserId(user.id);
                onOpen();
              }}
            >
              <IoTrashBinSharp />
            </span>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const userList = searchQuery ? searchResults : usersList;

  return (
    <>
      <div className="w-full h-32">
        <div className="HStack w-full h-full justify-between">
          <div className="VStack gap-4">
            <h2 className="text-3xl font-semibold">Users</h2>
            <p className="text-lg">
              User management tool
            </p>
          </div>
        
        </div>
      </div>

      <section className="VSatck w-full">
        <div className="w-full HStack gap-5 items-center justify-end mb-5">
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            type="text"
            variant="bordered"
            size="sm"
            label="Search"
          />
          <Button>
            <IoFilterOutline />
            <p>Filters</p>
          </Button>
        </div>
        <Table className="" aria-label="User Table">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={userList}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey.toString())}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Remove FacePass Account
              </ModalHeader>
              <ModalBody>
                <p>
                Developers on the FacePass Developer Platform (Developer.facepass.net) must ensure they have legitimate reasons for removing a User from a project, such as violations of terms, inactivity, or security concerns, and must notify Users, providing reasons and relevant documentation. Users have the right to receive a notification about their removal, including the reason and any potential appeal process. Developers must provide a 7-day grace period for Users to appeal or resolve issues before final removal, during which Users can contact the Developer for clarification or dispute. Post-removal, Developers must handle the User’s data per the FacePass Privacy Policy and data protection regulations, informing Users about data handling and options for retrieval or deletion. Developers must review and respond to appeals within a reasonable timeframe, providing a final decision. Compliance with FacePass policies, including privacy and user rights, is mandatory, and abuse of the removal process may result in the Developer’s account suspension or termination. By managing projects, Developers agree to these terms and conditions for removing Users from projects.
                </p>
              </ModalBody>
              <ModalFooter className="w-full justify-between">
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                {selectedUserId !== undefined && (
                  <Button
                    color="danger"
                    onPress={() => {
                      handleRemoveUser(selectedUserId);
                      onClose();
                    }}
                  >
                    Remove
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserList;
