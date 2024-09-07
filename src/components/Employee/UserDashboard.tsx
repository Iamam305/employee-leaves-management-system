"use client";
import React, { useEffect, useState } from "react";
import UserStatsCard from "./UserStatsCard";
import LeaveCalendar from "./LeaveCalendar";
import axios from "axios";
import LineChart from "../dashboard/stats/LineChart";
import DoughnutChart from "../dashboard/stats/DoughnutChart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CalendarIcon, DownloadCloudIcon } from "lucide-react";
import { format } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Skeleton } from "../ui/skeleton";
import BalanceChart from "../dashboard/stats/BalanceChart";
import dayjs from "dayjs";

const UserDashboard = ({ id }: any) => {
  const router = useRouter();
  const pathname = usePathname();

  const current_user: any = useSelector(
    (state: any) => state.membership.memberShipData
  );

  const isHrOrAdmin =
    current_user.role === "hr" || current_user.role === "admin";

  console.log(`Auth Data==> ${isHrOrAdmin} and ${current_user.role} `);

  const userId = id || current_user.user_id;

  const [acceptedLeavesData, setAcceptedLeavesData] = useState<any>([]);
  const [rejectedLeavesData, setRejectedLeavesData] = useState<any>([]);
  const [totalAcceptedLeaves, setTotalAcceptedLeaves] = useState<number>();
  const [totalRejectedLeaves, setTotalRejectedLeaves] = useState<number>();
  const [totalbalances, setTotalBalances] = useState<number>(0);
  const [totalmonthbalances, setTotalMonthBalances] = useState<number>(0);
  const [totalLeaves, setTotalLeaves] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<any>();
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const [balanceData, setBalanceData] = useState<any>([]);

  // &org_id=669f97ab186ea1a384360673

  const fetchUserDashboardDetails = async () => {
    try {
      setLoading(true);
      let queryString = `user_id=${userId}`;

      if (selectedMonth) {
        const monthYear = format(selectedMonth, "yyyy-MM");
        queryString += `&monthYear=${monthYear}`;
      }

      const response = await axios.get(`/api/dashboard/user?${queryString}`);
      const data = response.data;

      // Handling accepted leaves
      const acceptedLeaves = data.accepted_leaves?.[0] || {};
      setTotalAcceptedLeaves(acceptedLeaves.totalAcceptedLeaves || 0);
      setAcceptedLeavesData(acceptedLeaves.accepted_leaves || []);

      // Handling rejected leaves
      const rejectedLeaves = data.rejected_leaves?.[0] || {};
      setTotalRejectedLeaves(rejectedLeaves.totalRejectedLeaves || 0);
      setRejectedLeavesData(rejectedLeaves.rejecetd_leaves || []);

      // Handling total leaves
      const totalLeavesData = data.totalLeaves?.[0] || {};
      setTotalLeaves(totalLeavesData.totalLeaves || 0);

      // Balance Data
      setBalanceData(data.balances);
    } catch (error) {
      console.error("API request failed:", error);
      // Reset state in case of error
      setTotalAcceptedLeaves(0);
      setAcceptedLeavesData([]);
      setTotalRejectedLeaves(0);
      setRejectedLeavesData([]);
      setTotalLeaves(0);
    } finally {
      setLoading(false);
    }
  };

  // const fetchbalance = async () => {
  //   try {
  //     if (current_user) {
  //       let month;
  //       if (selectedMonth) {
  //         month = dayjs(selectedMonth).month();
  //       } else {
  //         month = dayjs().month();
  //       }
  //       const { data } = await axios.get(`/api/balances/${current_user.user_id}`);
  //       console.log("totabalnce of user ", data);
  //       setTotalBalances(data.totalbalance[0]);
  //       setTotalMonthBalances(data.totalbalance[1][month]);
  //     }
  //   } catch (error) {}
  // };

  const fetchbalance = async () => {
    try {
      const balanceUserId = isHrOrAdmin && id ? id : current_user.user_id;
      let month;
      if (selectedMonth) {
        month = dayjs(selectedMonth).month();
      } else {
        month = dayjs().month();
      }
      const { data } = await axios.get(`/api/balances/${balanceUserId}`);
      console.log("totabalnce of user ", data);
      setTotalBalances(data.totalbalance[0]);
      setTotalMonthBalances(data.totalbalance[1][month]);
    } catch (error) {
      console.error("Balance fetch error: ", error);
    }
  };

  useEffect(() => {
    fetchUserDashboardDetails();
    fetchbalance();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const query_params = new URLSearchParams();
    if (selectedMonth) {
      const formattedMonth = format(selectedMonth, "yyyy-MM");
      query_params.set("month", formattedMonth);
    }
    const queryString = query_params.toString();
    const newPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newPath);
  }, [selectedMonth, selectedYear]);

  const handleMonthSelect = (monthIndex: number) => {
    const updatedDate = new Date(selectedYear, monthIndex);
    setSelectedMonth(updatedDate);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value));
  };

  // console.log("balances ==> ",balanceData[0]?.leaveBalances)

  return (
    <div>
      <div className="flex md:flex-row flex-col items-center gap-4 justify-between md:pl-10 md:mb-0 mb-4 ">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="month-year-picker"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !selectedMonth && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedMonth ? (
                `${format(selectedMonth, "MMMM")} ${selectedYear}`
              ) : (
                <span>Pick a month and year</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <div className="flex justify-between mb-4">
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="border p-2 rounded bg-gray-400 text-black"
              >
                {Array.from(
                  { length: 10 },
                  (_, i) => new Date().getFullYear() - i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full"
                  onClick={() => handleMonthSelect(i)}
                >
                  {format(new Date(selectedYear, i), "MMMM")}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {(current_user.role === "admin" ||
          current_user.role === "hr" ||
          current_user.role === "manager") && (
            <Button
            className=" flex gap-2 items-center"
            // onClick={handleDownloadReports}
            disabled={loading}
          >
            <DownloadCloudIcon className=" h-4 w-4" />
            {loading ? "Downloading..." : "Download Reports"}
          </Button>
          )}
      </div>

      <div className="w-full md:p-4 p-1 flex md:flex-row  flex-col-reverse items-start gap-5 justify-around ">
        <div className="md:w-[40%] h-[40vh]  w-full">
          <LeaveCalendar userId={userId} loading={loading} />
        </div>
        <div className="md:w-[60%] md:h-[40vh] w-full h-fit">
          <UserStatsCard
            loading={loading}
            totalLeaves={totalLeaves}
            totalRejectedLeaves={totalRejectedLeaves}
            totalAcceptedLeaves={totalAcceptedLeaves}
            totalUsers={70}
            totalbalance={totalbalances}
            totalmonthbalances={totalmonthbalances}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5 md:p-4 p-0">
        {loading ? (
          <Skeleton className=" w-full h-64" />
        ) : (
          <LineChart
            className="w-full h-64"
            data={acceptedLeavesData}
            title={"Approved Leaves"}
          />
        )}

        {loading ? (
          <Skeleton className=" w-full h-64" />
        ) : (
          <LineChart
            className="w-full h-64"
            data={rejectedLeavesData}
            title={"Rejected Leaves"}
          />
        )}

        <BalanceChart balances={balanceData} className="w-full h-64" />
      </div>
    </div>
  );
};

export default UserDashboard;
