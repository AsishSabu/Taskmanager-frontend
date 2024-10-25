import { useState } from "react";
import { Table } from "flowbite-react";

interface UserDataProps {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

const TableData: React.FC<UserDataProps> = ({ name, email, isBlocked }) => {
  const [isChecked, setIsChecked] = useState<boolean>(isBlocked);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <Table.Row className="bg-gray-50 text-black dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {name}
      </Table.Cell>
      <Table.Cell>{email}</Table.Cell>
      <Table.Cell>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isChecked ? "bg-red-500" : "bg-green-400"}`}></div>
          <p>{isChecked ? "Blocked" : "Active"}</p>
        </div>
      </Table.Cell>
      <Table.Cell>
        <label className="flex cursor-pointer select-none items-center">
          <div className="relative">
            <input
              title="title"
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="sr-only"
            />
            <div className={`block h-6 w-10 rounded-full ${isChecked ? "bg-red-500" : "bg-green-500"}`}></div>
            <div
              className={`absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition ${isChecked ? "translate-x-full" : ""}`}
            ></div>
          </div>
        </label>
      </Table.Cell>
    </Table.Row>
  );
};

export default TableData;
