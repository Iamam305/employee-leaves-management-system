"use client";
import React, { useEffect, useState } from "react";
import LineChart from "./stats/LineChart";
import axios from "axios";
import DoughnutChart from "./stats/DoughnutChart";
import StatsCards from "./StateCards";
import { useSelector } from "react-redux";
import { Skeleton } from "../ui/skeleton";
import TotalBalanceChart from "./stats/TotalBalanceChart";
import { DownloadCloudIcon } from "lucide-react";
import { Button } from "../ui/button";
import LeaveRequestModal from "../leaves/LeaveRequestModal";
import { toast } from "sonner";

const ChartData = () => {
  const org_id = useSelector((state: any) => state.organization.selectedOrg);
  const userRole = useSelector((state: any) => state.auth.userData);
  const current_user_role = useSelector(
    (state: any) => state.membership.memberShipData
  );

  const [usersData, setUsersData] = useState<any>([]);
  const [leavesData, setLeavesData] = useState<any>([]);
  const [pendingLeaves, setPendingLeaves] = useState<any>([]);
  const [leavesInfo, setLeavesInfo] = useState<any>([]);
  const [totalLeaves, setTotalLeaves] = useState<number>(0);
  const [totalbalances, setTotalBalances] = useState<number>();
  const [totalPendingLeaves, setTotalPendingLeaves] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [balanceHistory, setBalanceHistory] = useState<any>([]);
  const [reportloading, setReportLoading] = useState<boolean>(false);

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
      setBalanceHistory(data.leaveType[0].leaveTypes);
      setTotalBalances(data.leaveType[0].total[0]?.totalCount);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchbalance = async () => {
    try {
      if (userRole) {
        const { data } = await axios.get(`/api/balances/${userRole._id}`);
        console.log("totabalnce of user ", data);
        setTotalBalances(data.totalbalancecredit);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchAllUsers();
    fetchbalance();
  }, [org_id]);

  const handleDownloadReports = async () => {
    try {
      setReportLoading(true);
      let url = "/api/generate/leave-report";
      if (current_user_role.role === "admin" && org_id !== null) {
        url += `?org_id=${org_id}`;
      }
      const response = await axios.get(url, {
        responseType: "blob",
      });
      const download_url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = download_url;
      link.setAttribute("download", `leave-report.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setReportLoading(false);
    } catch (error) {
      toast.error("Something Unexpected Happpened! We are trying to fix");
      setReportLoading(false);
    }
  };

  console.log("Total Balance ==> ", totalbalances, typeof totalbalances);

  return (
    <div>
      <div className="w-full flex items-center justify-end p-2 gap-2 mb-4">
        {current_user_role.role !== "manager" && (
          <Button
            className=" flex gap-2 items-center"
            onClick={handleDownloadReports}
            disabled={reportloading}
          >
            <DownloadCloudIcon className=" h-4 w-4" />
            {reportloading ? "Downloading..." : "Download Reports"}
          </Button>
        )}
        {current_user_role.role === "admin" && (
          <LeaveRequestModal title="Apply For Leave" />
        )}
      </div>

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
          totalBalances={totalbalances}
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
          <Skeleton className="w-full h-64" />
        ) : (
          <>
            {current_user_role.role === "admin" && org_id !== null ? (
              <TotalBalanceChart data={balanceHistory} />
            ) : current_user_role.role === "hr" ||
              current_user_role.role === "manager" ? (
              <TotalBalanceChart data={balanceHistory} />
            ) : null}
          </>
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
