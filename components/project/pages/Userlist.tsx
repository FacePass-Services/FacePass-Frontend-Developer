import React from "react";
import { Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { IoFilterOutline } from "react-icons/io5";
import { IoTrashBinSharp } from "react-icons/io5";
import axios from "axios"; // Import Axios for making HTTP requests

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  phone_number: string;
  // Add other properties as per your actual user object structure
}

interface Props {
  users: User[];
  project_id: any; // Replace 'any' with the actual type of your project object
}

const columns = [
  { name: "First Name", uid: "first_name" },
  { name: "Last Name", uid: "last_name" },
  { name: "Email", uid: "email" },
  { name: "Gender", uid: "gender" },
  { name: "Date of Birth", uid: "date_of_birth" },
  { name: "Phone Number", uid: "phone_number" },
  { name: "Actions", uid: "actions" },
];

const statusColorMap = {
  active: "success",
  deactive: "danger",
};

const UserList: React.FC<Props> = ({ users, project_id }) => {
console.log(project_id);

  const handleRemoveUser = async (userId: number) => {
    try {
        
      const response = await axios.delete('http://127.0.0.1:5000/project/remove_user', {
        data: { project_id: project_id, user_id: userId }
      });
      console.log(response.data.message); // Log success message
      // Implement logic to update UI (e.g., remove user from state)
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  const renderCell = (user: User, columnKey: string) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span
              className="text-lg text-danger cursor-pointer active:opacity-50"
              onClick={() => handleRemoveUser(user.id)}
            >
              <IoTrashBinSharp />
            </span>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <>
      <div className="w-full h-32">
        <div className="HStack w-full h-full justify-between">
          <div className="VStack gap-4">
            <h2 className="text-3xl font-semibold">Users</h2>
            <p className="text-lg">
              Customers lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
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
          <Input type="text" variant="bordered" size="sm" label="Search" />
          <Button>
            <IoFilterOutline />
            <p>Filters</p>
          </Button>
        </div>
        <Table className="" aria-label="User Table">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={users}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default UserList;
