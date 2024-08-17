import ChartData from "@/components/dashboard/ChartData";
import StatsCards from "@/components/dashboard/StateCards";
import LeaveRequestModal from "@/components/leaves/LeaveRequestModal";
import LeaveTypeModal from "@/components/leaves/LeaveTypeModal";
import React from "react";

const Page = () => {
  return (
    <>
      <div className="w-full flex items-center justify-end p-2 gap-2">
      {/* <LeaveTypeModal title="Create Leave Type" /> */}
      <LeaveRequestModal title="Apply For Leave"/>
      </div>
      <ChartData />
    </>
  );
};

export default Page;
