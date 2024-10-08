"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { FormateDate, getDays } from "@/lib/utils";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const truncateText = (text: any, length: number) => {
  const str = text ? String(text) : "";
  return str.length <= length ? str : str.substring(0, length) + "...";
};

const LeaveModal: React.FC<{
  title: string;
  accessorKey: any;
  onclose?: any;
  // row: LeavetypeInterface;
}> = ({ title, accessorKey, onclose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setstatus] = useState("");
  const [isloading, setIsLoading] = useState(false);
  console.log(accessorKey._id);

  console.log("Accessor Key ==> ", accessorKey);

  const membership: any = useSelector(
    (state: any) => state.membership.memberShipData
  );

  const handleAction = async (status: string) => {
    try {
      setIsLoading(true);
      setstatus(status);
      const response = await axios.post("/api/approve-leave", {
        leave_id: accessorKey._id,
        org_id: membership.org_id,
        statusupdate: status,
      });

      // Assuming the response contains a message
      toast.success(response.data.message || "Action completed successfully!");

      // Close the modal
      setIsOpen(false);
      onclose();
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast.error("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };
  const pdfUrl = `https://mushroomworld.blr1.digitaloceanspaces.com/mw-leaves/${accessorKey.docs}`;
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.download = "Attachemnt";
    link.click();
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)} className="cursor-pointer">
        {title}
      </span>
      <>
        <Modal
          title="Leave Application"
          // description={accessorKey.status}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <span
            className={
              accessorKey.status === "pending"
                ? "capitalize text-grey-100"
                : accessorKey.status === "approved"
                ? "capitalize text-green-400 font-semibold"
                : "capitalize text-red-400 font-semibold"
            }
          >
            {accessorKey.status}
          </span>
          {/* <div className="p-4"> */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
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
                {(membership.role !== 'employee' && membership.role !== 'manager') && (
              accessorKey.manager ? (
                <>
                 <div className="font-semibold">Manager Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Manager Name
                      </span>
                      <span>{accessorKey.manager.name}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Manager Email
                      </span>
                      <span>{accessorKey.manager.email}</span>
                    </li>
                  </ul>
                </>
              )
              : (
                <>
                 <div className="font-semibold">Manager Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                     No Manager Alloted
                    </li>
                  </ul>
                </>
              )
            )}
                  <Separator className="my-2" />
                  <div className="font-semibold">Leave Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Employee Name
                      </span>
                      <span>{accessorKey.user.name}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Organization Name
                      </span>
                      <span>{accessorKey.org.name}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Start Date</span>
                      <span>{FormateDate(accessorKey.start_date)}</span>
                      {/* <span>{accessorKey.start_date}</span> */}
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">End Date</span>
                      <span>{FormateDate(accessorKey.end_date)}</span>
                      {/* <span>{accessorKey.end_date}</span> */}
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">No of Days</span>
                      <span>
                        {getDays(accessorKey.start_date, accessorKey.end_date)}
                      </span>
                    </li>
                    <li className="flex flex-col items-start">
                      <span className="text-muted-foreground">Description</span>
                      <span className="text-justify">
                        {accessorKey.description}
                      </span>
                    </li>
                    {accessorKey?.docs && (
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Attachement
                        </span>
                        <Button onClick={handleDownload}>Download</Button>
                      </li>
                    )}
                  </ul>
                  <Separator className="my-2" />
                  <div className="font-semibold">Leave Type Details</div>
                  <ul className="grid gap-3">
                    {/* Leave Type Deatails  */}

                    <li className="flex items-center justify-start gap-2">
                      <span className="text-muted-foreground">Name</span>
                      <span>{accessorKey.leave_type.name}</span>
                    </li>

                    <li className="flex flex-col items-start">
                      <span className="text-muted-foreground">Description</span>
                      <span className="text-justify">
                        {accessorKey.leave_type.description}
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          {accessorKey.status === "pending" && membership.role !== 'employee' && (
            <>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => handleAction("approved")}
                >
                  {isloading && status === "approved"
                    ? "Submitting.."
                    : "Approve"}
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={() => handleAction("rejected")}
                >
                  {isloading && status === "rejected"
                    ? "Submitting.."
                    : "Reject"}
                </Button>
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
