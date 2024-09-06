"use client";
import ChartData from "@/components/dashboard/ChartData";
import UserDashboard from "@/components/Employee/UserDashboard";
import LeaveRequestModal from "@/components/leaves/LeaveRequestModal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { DownloadCloudIcon } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const Page = () => {
  const user_role = useSelector(
    (state: any) => state.membership.memberShipData?.role
  );

  const selectedOrgId = useSelector(
    (state: any) => state.organization.selectedOrg
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleDownloadReports = async () => {
    try {
      setLoading(true);
      let url = "/api/generate/leave-report";
      if (user_role === "admin" && selectedOrgId !== null) {
        url += `?org_id=${selectedOrgId}`;
      }
      const response = await axios.get(url, {
        responseType: "blob",
      });
      const download_url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = download_url;
      link.setAttribute("download", `leave-report.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setLoading(false);
    } catch (error) {
      toast.error("Something Unexpected Happpened! We are trying to fix");
      setLoading(false);
    }
  };

  return (
    <>
      {user_role === "employee" && (
        <>
          <div className="w-full flex items-center justify-end p-2 gap-2">
            <LeaveRequestModal title="Apply For Leave" />
          </div>
          <UserDashboard />
        </>
      )}
      {(user_role === "admin" ||
        user_role === "hr" ||
        user_role === "manager") && (
        <>
          <div className="w-full flex items-center justify-end p-2 gap-2">
            {user_role !== "manager" && (
              <Button
                className=" flex gap-2 items-center"
                onClick={handleDownloadReports}
                disabled={loading}
              >
                <DownloadCloudIcon className=" h-4 w-4" />
                {loading ? "Downloading..." : "Download Reports"}
              </Button>
            )}
            {user_role === "admin" && (
              <LeaveRequestModal title="Apply For Leave" />
            )}
          </div>
          <ChartData />
        </>
      )}
    </>
  );
};

export default Page;
