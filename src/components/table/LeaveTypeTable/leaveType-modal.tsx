"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeavetypeInterface } from "@/lib/type";
import { FormateDate, getDays } from "@/lib/utils";
import { Description } from "@radix-ui/react-dialog";
import axios from "axios";
import dayjs from "dayjs";
import { EditIcon } from "lucide-react";
import { set } from "mongoose";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";


const truncateText = (text: any, length: number) => {
  const str = text ? String(text) : "";
  return str.length <= length ? str : str.substring(0, length) + "...";
};

const LeaveTypeTableModal: React.FC<{
  title: string;
  accessorKey: any;
  // row: LeavetypeInterface;
}> = ({ title , accessorKey}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setstatus] = useState("")
  const [isloading , setIsLoading] = useState(false)
  // console.log(accessorKey._id)
  
  const membership:any = useSelector((state:any) => state.membership.memberShipData)
  const handleAction = async (status: string) => {
    try {
      setIsLoading(true);
      setstatus(status)
      const response = await axios.post('/api/approve-leave', {
        leave_id: accessorKey._id,
        org_id: membership.org_id,
        statusupdate:status,
      });

      // Assuming the response contains a message
      toast.success(response.data.message || "Action completed successfully!");

      // Close the modal
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast.error("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      <span
        onClick={() => setIsOpen(true)}
        className="cursor-pointer"
      >{title}
        {/* {truncatedText && truncatedText !== "N/A" ? "View" : "N/A"} */}
      </span>
      {/* {truncatedText !== "N/A" && ( */}
        <>
          <Modal
            title="Leave Type"
            // description={accessorKey.status}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          >
            {/* <div className="p-4"> */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
            <Card className="overflow-hidden max-h-[774px]">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Leave Type details
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-2 text-sm">
        <div className="grid gap-3">
          <ul className="grid gap-3">
            <li className="flex items-center justify-between capitalize">
              <span className="text-muted-foreground">Name</span>
              <span>{accessorKey.name}</span>
            </li>
            <li className="flex items-center justify-between capitalize">
              <span className="text-muted-foreground">Organization Name</span>
              <span>{accessorKey.org.name}</span>
            </li>
            <li className="flex items-center justify-between capitalize">
              <span className="text-muted-foreground">Carry Forward</span>
              <span>{accessorKey.does_carry_forward.toString()}</span>
            </li>
            <li className="flex items-center justify-between capitalize">
              <span className="text-muted-foreground">Count Per Month</span>
              <span>{accessorKey.count_per_month}</span>
            </li>
            <li className="flex items-center justify-between capitalize">
              <span className="text-muted-foreground">Created At</span>
              <span>{FormateDate(accessorKey.createdAt)}</span>
            </li>
            <li className="flex items-center justify-between capitalize">
              <span className="text-muted-foreground">Updated At</span>
              <span>{FormateDate(accessorKey.updatedAt)}</span>
            </li>
            <li className="flex flex-col items-start">
              <span className="text-muted-foreground">Description</span>
              <span className="text-justify mt-2">
              {accessorKey.description}
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
            </div>
          </Modal>
        </>
      {/* )} */}
    </>
  );
};

export default LeaveTypeTableModal;
