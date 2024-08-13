"use client";
import React, { useEffect, useState } from "react";
import LineChart from "./stats/LineChart";
import axios from "axios";
import DoughnutChart from "./stats/DoughnutChart";

const ChartData = () => {
  const [usersData, setUsersData] = useState<any>([]);
  const [leavesData, setLeavesData] = useState<any>([]);
  const [pendingLeaves, setPendingLeaves] = useState<any>([]);
  const [leavesInfo, setLeavesInfo] = useState<any>([]);

  const fetchAllUsers = async () => {
    const { data } = await axios.get("/api/dashboard");
    setUsersData(data.users);
    setLeavesData(data.leaves);
    setPendingLeaves(data.pending_leaves);
    setLeavesInfo(data.leaves_data);
    console.log(data);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div>
      <div className=" flex md:flex-row flex-col md:max-w-[82vw] w-full  gap-6 mb-5 p-4">
        <LineChart data={usersData} title={"Total Users"} />
        <LineChart data={leavesData} title={"Total Leaves"} />
      </div>
      <div className=" flex items-center justify-center">
        <LineChart data={pendingLeaves} title={"Pending Leaves"} />
        <DoughnutChart data={leavesInfo} title={"Leaves Info"} />
      </div>
    </div>
  );
};

export default ChartData;
