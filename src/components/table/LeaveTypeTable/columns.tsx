"use client";
import { ColumnDef } from "@tanstack/react-table";
import AnalysisModal from "./leaveType-modal";
import AnalysisTooltip from "./leaveType-tooltip";
// import { ViewLeavetypeInterface } from "@/lib/types";
import { ViewLeavetypeInterface } from "@/lib/type";
import LeaveToolTip from "./leaveType-tooltip";
import { Badge } from "@/components/ui/badge";
import { FormateDate } from "@/lib/utils";
import LeaveTypeTableModal from "./leaveType-modal";
import LeaveTypeEditModal from "./leaveTypeEdit-modal";

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

export const columns = (fetchData: () => void , role:string): ColumnDef<ViewLeavetypeInterface>[] => {
  const baseColumns: ColumnDef<ViewLeavetypeInterface>[] = [
  {
    accessorKey: "index",
    header: "S.No",
    cell: ({ row }) =>
      truncateText(row.index + 1 || "N/A", 10),
  },
  {
    accessorKey: "user",
    header: "Name",
    cell: ({ row }) =>row.original.name ,
  },
  {
    accessorKey: "createdAt",
    header: "Date of Creation",
    cell: ({ row }:any) => (
      // truncateText(row.original.call_info?.unique_identifier || "", 10),
      <LeaveToolTip data={FormateDate(row.original.createdAt)} />
    ),
  },
  {
    accessorKey: "org",
    header: "Orgnisation Name",
    cell: ({ row }) => <LeaveToolTip data={row.original.org.name || "N/A"} />,
  },
  {
    accessorKey: "does_carry_forward",
    header: "Carry Forward",
    cell: ({ row }) => (
      row.original.does_carry_forward ? (
        <Badge className="capitalize" variant="success">{row.original.does_carry_forward.toString()}</Badge>
      ) : (
        <Badge className="capitalize" variant="destructive">{row.original.does_carry_forward.toString()}</Badge>
      )
    ),
  },
  {
    accessorKey: "",
    header: "View",
    cell: ({ row }) => (
      <LeaveTypeTableModal title="View" accessorKey={row.original}/>
    ),
  },
  // {
  //   accessorKey: "",
  //   header: "Edit",
  //   cell: ({ row }) => (
  //     <LeaveTypeEditModal title="Edit" accessorKey={row.original} fetchData={fetchData}/>
  //   ),
  // },
];

if (role === ("admin" || "hr")) {
    baseColumns.push(
      {
        accessorKey: "",
        header: "Edit",
        cell: ({ row }) => (
          <LeaveTypeEditModal title="Edit" accessorKey={row.original} fetchData={fetchData}/>
        ),
      },);
  }

return baseColumns;
}
