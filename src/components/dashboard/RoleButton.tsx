import React from "react";
import { Button } from "@/components/ui/button";

interface RoleButtonProps {
  role: string;
}

const RoleButton: React.FC<RoleButtonProps> = ({ role }) => {
  const getColorByRole = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-500 hover:bg-red-600";
      case "user":
        return "bg-green-500 hover:bg-green-600";
      case "editor":
        return "bg-blue-500 hover:bg-blue-600";
      case "manager":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Button
      className={`px-3 py-1 text-xs font-semibold w-1/2 text-white rounded-full ${getColorByRole(
        role
      )}`}
      variant="ghost"
    >
      {role}
    </Button>
  );
};

export default RoleButton;
