"use client";
import { ColumnDef } from "@tanstack/react-table";
import AnalysisModal from "./leave-modal";
import AnalysisTooltip from "./leave-tooltip";
// import { LeavetypeInterface } from "@/lib/types";
import { LeavetypeInterface } from "@/lib/type";
import LeaveToolTip from "./leave-tooltip";
import { Badge } from "@/components/ui/badge";
import LeaveModal from "./leave-modal";

const truncateText = (text: any, length: number) => {
  const str = text ? String(text) : "";
  return str.length <= length ? str : str.substring(0, length) + "...";
};


// _id:Types.ObjectId,  
//   user_id: user_id;
//   leave_type_id: leave_type_id;
//   org_id: Types.ObjectId;
//   start_date: Date;
//   end_date: Date;
//   description?: string;
//   status: "pending" | "approved" | "rejected";
//   createdAt?: Date;
//   updatedAt?: Date;

export const columns = (fetchData: () => void): ColumnDef<LeavetypeInterface>[] => [
  {
    accessorKey: "index",
    header: "S.No",
    cell: ({ row }) =>
      truncateText(row.index + 1 || "N/A", 10),
  },
  {
    accessorKey: "user",
    header: "Employee Name",
    cell: ({ row }) =>row.original.user.name ,
  },
  {
    accessorKey: "leave_type",
    header: "Leave Type",
    cell: ({ row }) => (
      // truncateText(row.original.call_info?.unique_identifier || "", 10),
      <LeaveToolTip data={row.original.leave_type.name} />
    ),
  },
  {
    accessorKey: "org",
    header: "Orgnisation Name",
    cell: ({ row }) => <LeaveToolTip data={row.original.org.name} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      row.original.status === "pending" ? (
        <Badge variant="warning">{row.original.status}</Badge>
      ) : (
        row.original.status === "approved" ? (
          <Badge variant="success">{row.original.status}</Badge>
        ) : (
          <Badge variant="destructive">{row.original.status}</Badge>
        )
      )
    ),
  },
  {
    accessorKey: "",
    header: "View",
    cell: ({ row }) => (
      <LeaveModal title="View" accessorKey={row.original} onclose={fetchData}/>
    ),
  },
];
