"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import React, { useEffect, useState } from "react";
import { LeaveTypeForm } from "./LeaveTypeForm";


const truncateText = (text: any, length: number) => {
  const str = text ? String(text) : "";
  return str.length <= length ? str : str.substring(0, length) + "...";
};

const LeaveTypeModal: React.FC<{
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
            title="Create Leave LeaveType"
            // description={accessorKey.status}
            isOpen={isOpen}
            onClose={handleclose}
          >
            <div className="p-4 max-h-[60vh] overflow-y-auto">
            <Card className="overflow-hidden max-h-[774px]">
      <CardContent>
        <LeaveTypeForm onclose={handleclose}/>
      </CardContent>
    </Card>
            </div>
          </Modal>
        </>
    </>
  );
};

export default LeaveTypeModal;
