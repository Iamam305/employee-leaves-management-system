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
  return (
    <>
      {user_role === "employee" && (
        <>
          <UserDashboard />
        </>
      )}
      {(user_role === "admin" ||
        user_role === "hr" ||
        user_role === "manager") && (
        <>
          <ChartData />
        </>
      )}
    </>
  );
};

export default Page;
