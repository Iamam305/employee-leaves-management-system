"use client";
import React, { useEffect, useState } from "react";
import LineChart from "./stats/UsersChart";
import axios from "axios";
import UsersChart from "./stats/UsersChart";

const GraphData = () => {
  const [usersData, setUsersData] = useState<any>([]);
  const[leavesData,setLeavesData] = useState<any>([]);

  const fetchAllUsers = async () => {
    const { data } = await axios.get("/api/dashboard");
    setUsersData(data.users);
    setLeavesData(data.leaves)
    console.log(data)
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  console.log("user_total: ",usersData)

  return (
    <div>
      <UsersChart data={usersData} title={"Total Users"}/>
      <UsersChart data={leavesData} title={"Total Leaves"}/>
    </div>
  );
};

export default GraphData;
