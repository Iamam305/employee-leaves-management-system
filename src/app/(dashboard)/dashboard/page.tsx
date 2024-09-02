"use client";
import ChartData from "@/components/dashboard/ChartData";
import UserDashboard from "@/components/Employee/UserDashboard";
import LeaveRequestModal from "@/components/leaves/LeaveRequestModal";
import React from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const user_role = useSelector(
    (state: any) => state.membership.memberShipData?.role
  );

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
