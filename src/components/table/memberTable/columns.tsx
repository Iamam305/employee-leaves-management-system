"use client";
import { ColumnDef, RowExpanding } from "@tanstack/react-table";
import { MemberTypeInterface } from "@/lib/type";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<MemberTypeInterface>[] = [
  {
    accessorKey: "S.No.",
    header: "S.no.",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "username",
    accessorKey: "name",
    cell: ({ row }) => row.original.username,
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: ({ row }) => row.original.email,
  },
  {
    header: "Organization",
    accessorKey: "organization",
    cell: ({ row }) => row.original.orgName,
  },
  {
    header: "Role",
    accessorKey: "role",
    cell: ({ row }) => (
      <Badge
        className={`max-w-20 text-center flex items-center justify-center hover:bg-inherit capitalize p-2 ${
          row.original.role === "admin"
            ? "bg-red-400 text-black"
            : row.original.role === "employee"
            ? "bg-blue-400 text-blue-800"
            : row.original.role === "hr"
            ? "bg-green-400 text-green-800"
            : row.original.role === "manager"
            ? "bg-yellow-400 text-purple-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {row.original.role}
      </Badge>
    ),
  },
];
