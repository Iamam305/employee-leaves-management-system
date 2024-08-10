"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeavetypeInterface } from "@/lib/type";
import { Description } from "@radix-ui/react-dialog";
import axios from "axios";
import dayjs from "dayjs";
import { set } from "mongoose";
import React, { useEffect, useState } from "react";

const truncateText = (text: any, length: number) => {
  const str = text ? String(text) : "";
  return str.length <= length ? str : str.substring(0, length) + "...";
};

const LeaveModal: React.FC<{
  title: string;
  accessorKey: any;
  // row: LeavetypeInterface;
}> = ({ title , accessorKey}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dataleave, setdataleave] = useState([])
  const [isloading , setIsLoading] = useState(false)
console.log(accessorKey)
  
// useEffect(() => {
// (async() => {
//   try {
//     setIsLoading(true);
//     const {data} = axios.get(`/api/leave/${accessorKey}`)
//   } catch (error) {
    
//   }
// })
// }, [])


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
            title="Leave Application"
            description={accessorKey.status}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          >
            {/* <div className="p-4"> */}
            <div className="p-4 max-h-[60vh]  overflow-y-auto">
            <Card className="overflow-hidden max-h-[774px]">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Leave Application Details
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Leave Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Employee Name</span>
              <span>{accessorKey.user_id.name}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Organization Name</span>
              <span>Mushroom Company</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Start Date</span>
              {/* <span>{dayjs(accessorKey.start_date).format("DD/MM/YYYY")}</span> */}
              <span>{accessorKey.start_date}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">End Date</span>
              {/* <span>{dayjs(accessorKey.end_date).format("DD/MM/YYYY")}</span> */}
              <span>{accessorKey.end_date}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">No of Days</span>
              <span>3</span>
            </li>
            <li className="flex flex-col items-start">
              <span className="text-muted-foreground">Description</span>
              <span className="text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut reprehenderit provident tenetur quibusdam consequatur, minus tempora culpa nihil iure adipisci, quas debitis aliquam cupiditate laborum aliquid commodi dolore exercitationem? Praesentium!
              </span>
            </li>
          </ul>
          <Separator className="my-2" />
          <div className="font-semibold">Leave Type Details</div>
          <ul className="grid gap-3">

            {/* Leave Type Deatails  */}
            
            <li className="flex items-center justify-start gap-2">
              <span className="text-muted-foreground">Name</span>
              <span>
                Vacations
              </span>
            </li>

            <li className="flex flex-col items-start">
              <span className="text-muted-foreground">Description</span>
              <span className="text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut reprehenderit provident tenetur quibusdam consequatur, minus tempora culpa nihil iure adipisci, quas debitis aliquam cupiditate laborum aliquid commodi dolore exercitationem? Praesentium!
              </span>
            </li>
            

          </ul>
        </div>
      </CardContent>
    </Card>
            </div>
            {accessorKey.status === "pending" && (
            <>
            <Separator className="my-4" />
           <div className="flex items-center justify-between">
            <Button variant="success" size="lg" onClick={() => setIsOpen(false)}>Appove</Button>
            <Button variant="destructive" size="lg" onClick={() => setIsOpen(false)}>Reject</Button>
           </div>
           </>
          )}
          </Modal>
        </>
      {/* )} */}
    </>
  );
};

export default LeaveModal;
