import GraphData from "@/components/dashboard/GraphData";
import StatsCards from "@/components/dashboard/StateCards";
import LeaveRequestModal from "@/components/leaves/LeaveRequestModal";
import React from "react";

const Page = () => {
  return (
    <>
      <div className="flex items-center justify-end">
      <LeaveRequestModal title="Apply For Leave"/>
      </div>
      <StatsCards />
      <GraphData />
    </>
  );
};

export default Page;
