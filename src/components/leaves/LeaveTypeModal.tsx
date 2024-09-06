"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import React, { useEffect, useState } from "react";
import { LeaveTypeForm } from "./LeaveTypeForm";
import { PlusIcon } from "lucide-react";

const truncateText = (text: any, length: number) => {
  const str = text ? String(text) : "";
  return str.length <= length ? str : str.substring(0, length) + "...";
};


const LeaveTypeModal: React.FC<{
  title: string;
  fetchData: () => void;
  orgs?:[];  // row: LeavetypeInterface;
}> = ({ title, fetchData , orgs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  //   console.log(accessorKey._id)

  const handleclose = () => {
    setIsOpen(false);
  };

   // Map the original org structure to the desired id and name structure
   const mappedOrgs = orgs?.map((org:any) => ({
    id: org._id, // Use _id for id
    name: org.name, // Keep the name field as it is
  }));

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="default"
        className=" flex items-center gap-2"
        // size="lg"
      >
        <PlusIcon className="h-4 w-4" />
        {title}
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
                <LeaveTypeForm fetchData={fetchData} onclose={handleclose} organizations={mappedOrgs}/>
              </CardContent>
            </Card>
          </div>
        </Modal>
      </>
    </>
  );
};

export default LeaveTypeModal;
