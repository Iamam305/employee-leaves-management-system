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
import { set } from "mongoose";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { LeaveRequestForm } from "./LeaveRequestForm";


const truncateText = (text: any, length: number) => {
  const str = text ? String(text) : "";
  return str.length <= length ? str : str.substring(0, length) + "...";
};

const LeaveRequestModal: React.FC<{
  title: string;
//   accessorKey: any
  // row: LeavetypeInterface;
}> = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isloading , setIsLoading] = useState(false)
//   console.log(accessorKey._id)

  const handleclose = () => {
    setIsOpen(false)
  }
  

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="default"
        // size="lg"
      >{title}
        {/* {truncatedText && truncatedText !== "N/A" ? "View" : "N/A"} */}
      </Button>
      {/* {truncatedText !== "N/A" && ( */}
        <>
          <Modal
            title="Request Leave Application"
            // description={accessorKey.status}
            isOpen={isOpen}
            onClose={handleclose}
          >
            <div className="p-4 max-h-[60vh] overflow-y-auto">
            <Card className="overflow-hidden max-h-[774px]">
      <CardContent>
        <LeaveRequestForm onclose={handleclose}/>
      </CardContent>
    </Card>
            </div>
          </Modal>
        </>
    </>
  );
};

export default LeaveRequestModal;
