"use client";
import React, { useEffect, useState } from "react";
import LineChart from "./stats/LineChart";
import axios from "axios";
import DoughnutChart from "./stats/DoughnutChart";
import StatsCards from "./StateCards";
import { useSelector } from "react-redux";

const ChartData = () => {
  const org_id = useSelector((state: any) => state.organization.selectedOrg);

  const [usersData, setUsersData] = useState<any>([]);
  const [leavesData, setLeavesData] = useState<any>([]);
  const [pendingLeaves, setPendingLeaves] = useState<any>([]);
  const [leavesInfo, setLeavesInfo] = useState<any>([]);
  const [totalLeaves, setTotalLeaves] = useState<number>(0);
  const [totalPendingLeaves, setTotalPendingLeaves] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const endpoint = org_id
        ? `/api/dashboard?org_id=${org_id}`
        : `/api/dashboard`;
      const { data } = await axios.get(endpoint);
      setUsersData(data.users[0]?.users || []);
      setTotalUsers(data.users[0]?.totalUsers || 0);
      setLeavesData(data.leaves[0]?.leaves || []);
      setTotalLeaves(data.leaves[0]?.totalLeaves || 0);
      setPendingLeaves(data.pending_leaves[0]?.pending_leaves || []);
      setTotalPendingLeaves(data.pending_leaves[0]?.totalPendingLeaves || 0);
      setLeavesInfo(data.leaves_data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllUsers();
  }, [org_id]);

  return (
    <div>
      <StatsCards
        totalLeaves={totalLeaves}
        totalPendingLeaves={totalPendingLeaves}
        totalUsers={totalUsers}
      />
      <div className="flex md:flex-row flex-col md:max-w-[82vw] w-full gap-6 mb-5 md:p-4 p-0">
        {usersData.length > 0 ? (
          <LineChart data={usersData} title={"Total Users"} />
        ) : (
          <p>No user data available</p>
        )}
        {leavesData.length > 0 ? (
          <LineChart data={leavesData} title={"Total Leaves"} />
        ) : (
          <p>No leaves data available</p>
        )}
      </div>
      <div className="flex md:flex-row flex-col md:max-w-[82vw] w-full gap-6 mb-5 md:p-4 p-0">
        {pendingLeaves.length > 0 ? (
          <LineChart data={pendingLeaves} title={"Pending Leaves"} />
        ) : (
          <p>No pending leaves data available</p>
        )}
        {leavesInfo.length > 0 ? (
          <DoughnutChart data={leavesInfo} title={"Leaves Info"} />
        ) : (
          <p>No leaves info available</p>
        )}
      </div>
    </div>
  );
};

export default ChartData;
