import { Badge } from "@/components/ui/badge";
import { MemberTypeInterface } from "@/lib/type";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns = (role: string): ColumnDef<MemberTypeInterface>[] => {
  const baseColumns: ColumnDef<MemberTypeInterface>[] = [
    {
      accessorKey: "S.No.",
      header: "S.no.",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Username",
      accessorKey: "name",
      cell: ({ row }) => {
        const username = row.original.username;

        if (
          (role === "admin" || role === "hr" || role === "manager") &&
          row.original.role === "employee"
        ) {
          return (
            <Link
              href={`/members/${row.original.id}`}
              className="hover:underline"
            >
              {username}
            </Link>
          );
        }

        return <span>{username}</span>;
      },
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

  // if (role === "admin") {
  //   baseColumns.push({
  //     header: "Credits",
  //     accessorKey: "credits",
  //     cell: ({ row }) => (
  //       <h1 className="flex items-center cursor-pointer text-blue-500">
  //         <Plus className="h-4 w-4" />
  //         Add Credits
  //       </h1>
  //     ),
  //   });
  // }

  return baseColumns;
};
