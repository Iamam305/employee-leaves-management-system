"use client";
import TableComponent from "@/components/dashboard/TableComponent";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import RoleButton from "@/components/dashboard/RoleButton";
import Link from "next/link";

const data: any = [
  { username: "JohnDoe", email: "john.doe@example.com", role: "Admin" },
  { username: "JaneSmith", email: "jane.smith@example.com", role: "User" },
  {
    username: "MikeJohnson",
    email: "mike.johnson@example.com",
    role: "Editor",
  },
  { username: "EmilyBrown", email: "emily.brown@example.com", role: "User" },
  {
    username: "ChrisWilson",
    email: "chris.wilson@example.com",
    role: "Manager",
  },
  { username: "SarahDavis", email: "sarah.davis@example.com", role: "User" },
  { username: "AlexTaylor", email: "alex.taylor@example.com", role: "Admin" },
  {
    username: "OliviaWhite",
    email: "olivia.white@example.com",
    role: "Editor",
  },
  { username: "DanielLee", email: "daniel.lee@example.com", role: "User" },
  {
    username: "SophiaClark",
    email: "sophia.clark@example.com",
    role: "Manager",
  },
];

const columns: ColumnDef<any>[] = [
  {
    header: "username",
    accessorKey: "username",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Role",
    accessorKey: "role",
    cell: ({ row }) => <RoleButton role={row.original.role} />,
  },
];

const Page = () => {
  return (
    <div className="p-4 ">
      <div className=" flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Members</h1>
        <div>
          <Button className="w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            <Link href={"/members/invite-members"}>
              <div className="flex items-center justify-center space-x-2">
                <PlusCircle className="h-5 w-5" />
                <span>Invite Members</span>
              </div>
            </Link>
          </Button>
        </div>
      </div>
      <TableComponent data={data} columns={columns} />
    </div>
  );
};

export default Page;
