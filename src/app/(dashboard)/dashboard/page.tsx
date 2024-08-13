import ChartData from "@/components/dashboard/ChartData";
import StatsCards from "@/components/dashboard/StateCards";
import LeaveRequestModal from "@/components/leaves/LeaveRequestModal";
import React from "react";

const Page = () => {
  return (
    <>
      <div className="flex items-center justify-end">
      <LeaveRequestModal title="Apply For Leave"/>
      </div>
      <ChartData />
    </>
  );
};

export default Page;
