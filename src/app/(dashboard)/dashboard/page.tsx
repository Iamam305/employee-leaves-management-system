"use client";
import ChartData from "@/components/dashboard/ChartData";
import StatsCards from "@/components/dashboard/StateCards";
import UserDashboard from "@/components/Employee/UserDashboard";
import LeaveRequestModal from "@/components/leaves/LeaveRequestModal";
import LeaveTypeModal from "@/components/leaves/LeaveTypeModal";
import { user } from "@nextui-org/react";
import React from "react";
import { useSelector } from "react-redux";

const Page = () => {
  // Assume memberShipData contains the role field directly
  const user_role = useSelector(
    (state: any) => state.membership.memberShipData?.role
  );

  console.log("User Role ==> ", user_role);

  return (
    <>
      {user_role === "employee" && (
        <div className=" w-full p-4 ">
          <UserDashboard />
        </div>
      )}
      {(user_role === "admin" ||
        user_role === "hr" ||
        user_role === "manager") && (
        <>
          <div className="w-full flex items-center justify-end p-2 gap-2">
            <LeaveRequestModal title="Apply For Leave" />
          </div>
          <ChartData />
        </>
      )}
    </>
  );
};

export default Page;
