"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import React, { useEffect, useState } from "react";
import { LeaveRequestForm } from "./LeaveRequestForm";
import { PlusIcon } from "lucide-react";

const truncateText = (text: any, length: number) => {
  const str = text ? String(text) : "";
  return str.length <= length ? str : str.substring(0, length) + "...";
};

const LeaveRequestModal: React.FC<{
  title: string;
  fetchData?: () => void;
  //   accessorKey: any
  // row: LeavetypeInterface;
}> = ({ title , fetchData}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  //   console.log(accessorKey._id)

  const handleclose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="default"
        className=" flex items-center gap-2"
        // size="lg"
      >
        <PlusIcon className=" h-4 w-4"/>
        {title}
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
            <Card className="min-h-[504px]">
              <CardContent>
                <LeaveRequestForm fetchData={fetchData} onclose={handleclose} />
              </CardContent>
            </Card>
          </div>
        </Modal>
      </>
    </>
  );
};

export default LeaveRequestModal;
