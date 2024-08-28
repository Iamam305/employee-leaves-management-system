"use client";
import React, { useEffect, useState } from "react";
import LineChart from "./stats/LineChart";
import axios from "axios";
import DoughnutChart from "./stats/DoughnutChart";
import StatsCards from "./StateCards";
import { useSelector } from "react-redux";
import { Skeleton } from "../ui/skeleton";

const ChartData = () => {
  const org_id = useSelector((state: any) => state.organization.selectedOrg);
  const userData = useSelector((state: any) => state.auth.userData);

  const [usersData, setUsersData] = useState<any>([]);
  const [leavesData, setLeavesData] = useState<any>([]);
  const [pendingLeaves, setPendingLeaves] = useState<any>([]);
  const [leavesInfo, setLeavesInfo] = useState<any>([]);
  const [totalLeaves, setTotalLeaves] = useState<number>(0);
  const [totalbalances, setTotalBalances] = useState<number>(0);
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

  const fetchbalance = async () => {
    try {
      if (userData) {
        const { data } = await axios.get(`/api/balances/${userData._id}`);
        console.log("totabalnce of user ", data);
        setTotalBalances(data.totalbalancecredit);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchAllUsers();
    fetchbalance();
  }, [org_id]);

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-between w-full gap-5 mb-5">
          <Skeleton className="h-40 w-1/4" />
          <Skeleton className="h-40 w-1/4" />
          <Skeleton className="h-40 w-1/4" />
          <Skeleton className="h-40 w-1/4" />
        </div>
      ) : (
        <StatsCards
          totalLeaves={totalLeaves}
          totalPendingLeaves={totalPendingLeaves}
          totalUsers={totalUsers}
          totalbalances={totalbalances}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5 md:p-4 p-0">
        {loading ? (
          <Skeleton className=" w-full h-64" />
        ) : (
          <LineChart
            className="w-full h-64"
            data={usersData}
            title={"Total Users"}
          />
        )}

        {loading ? (
          <Skeleton className=" w-full h-64" />
        ) : (
          <LineChart
            className="w-full h-64"
            data={leavesData}
            title={"Total Leaves"}
          />
        )}

        {loading ? (
          <Skeleton className=" w-full h-64" />
        ) : (
          <LineChart
            className="w-full h-64"
            data={pendingLeaves}
            title={"Pending Leaves"}
          />
        )}

        {loading ? (
          <Skeleton className=" w-full h-64" />
        ) : (
          <DoughnutChart
            className="w-full h-64"
            data={leavesInfo}
            title={"Leaves Info"}
          />
        )}
      </div>
    </div>
  );
};

export default ChartData;
