"use client";
import React, { useEffect, useState } from "react";
import LineChart from "./stats/LineChart";
import axios from "axios";
import DoughnutChart from "./stats/DoughnutChart";
import StatsCards from "./StateCards";

const ChartData = () => {
  const [usersData, setUsersData] = useState<any>([]);
  const [leavesData, setLeavesData] = useState<any>([]);
  const [pendingLeaves, setPendingLeaves] = useState<any>([]);
  const [leavesInfo, setLeavesInfo] = useState<any>([]);
  const [totalLeaves, setTotalLeaves] = useState<number>();
  const [totalPendingLeaves, setTotalPendingLeaves] = useState<number>();
  const[totalUsers,setTotalUsers] = useState<number>();

  const fetchAllUsers = async () => {
    const { data } = await axios.get("/api/dashboard");
    setUsersData(data.users[0].users);
    setTotalUsers(data.users[0].totalUsers)
    setLeavesData(data.leaves[0].leaves);
    setTotalLeaves(data.leaves[0].totalLeaves);
    setPendingLeaves(data.pending_leaves[0].pending_leaves);
    setTotalPendingLeaves(data.pending_leaves[0].totalPendingLeaves)
    setLeavesInfo(data.leaves_data);
    console.log(data);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  console.log("Leaves==> ", pendingLeaves);

  return (
    <div>
      <StatsCards totalLeaves={totalLeaves} totalPendingLeaves={totalPendingLeaves} totalUsers={totalUsers}/>
      <div className=" flex md:flex-row flex-col md:max-w-[82vw] w-full  gap-6 mb-5 md:p-4 p-0">
        <LineChart data={usersData} title={"Total Users"} />
        <LineChart data={leavesData} title={"Total Leaves"} />
      </div>
      <div className=" flex md:flex-row flex-col md:max-w-[82vw] w-full  gap-6 mb-5 md:p-4 p-0">
        <LineChart data={pendingLeaves} title={"Pending Leaves"} />
        <DoughnutChart data={leavesInfo} title={"Leaves Info"} />
      </div>
    </div>
  );
};

export default ChartData;
