"use client";
import { LeaveTypeEditForm } from "@/components/leaves/LeaveTypeEditForm";
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

const LeaveTypeEditModal: React.FC<{
  title: string;
  accessorKey: any;
  fetchData:() => void;
  // row: LeavetypeInterface;
}> = ({ title , accessorKey , fetchData}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setstatus] = useState("")
  const [isloading , setIsLoading] = useState(false)
  // console.log(accessorKey._id)
  
  const membership:any = useSelector((state:any) => state.membership.memberShipData)
  
//   const handleclose = () => {
//     // setIsOpen(false);
//     onclose;
//   }

// console.log('fetch modal' , fetchData)


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
                <LeaveTypeEditForm fetchData={fetchData} data={accessorKey} isOpen={isOpen} setIsOpen={setIsOpen}/>
            </div>
          </Modal>
        </>
      {/* )} */}
    </>
  );
};

export default LeaveTypeEditModal;
