"use client";
import React, { useEffect, useState } from "react";
import {
  format,
  eachDayOfInterval,
  isSameDay,
  getYear,
  getMonth,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

const LeaveCalendar = ({ userId, loading }: any) => {
  const [leavePeriods, setLeavePeriods] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const searchParams = useSearchParams();
  const month_param = searchParams.get("month");

  useEffect(() => {
    getLeavesDetails();
  }, [month_param]);

  useEffect(() => {
    if (month_param) {
      const [year, month] = month_param.split("-");
      setSelectedYear(parseInt(year, 10));
      setSelectedMonth(parseInt(month, 10) - 1);
    }
  }, [month_param]);

  const leaveDays = leavePeriods.flatMap(({ start, end }) =>
    eachDayOfInterval({ start: new Date(start), end: new Date(end) })
  );

  const id = userId || "66b5e16b725dba994dc40f7d";

  const getLeavesDetails = async () => {
    try {
      let api_url = `/api/org/get-members/${id}`;
      if (month_param) {
        api_url += `?month=${month_param}`;
      }
      const { data } = await axios.get(api_url);
      setLeavePeriods(data.leaves[0]?.leaves || []);
    } catch (error) {
      console.error("Error fetching leave details:", error);
    }
  };

  const generateCalendarDays = (year: number, month: number) => {
    const firstDayOfMonth = startOfMonth(new Date(year, month));
    const lastDayOfMonth = endOfMonth(new Date(year, month));
    const startDate = startOfWeek(firstDayOfMonth);
    const endDate = endOfWeek(lastDayOfMonth);
    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const renderDashboard = (year: number, month: number) => {
    const calendarDays = generateCalendarDays(year, month);
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div
        key={`${month}-${year}`}
        className="p-4 flex flex-col items-center justify-center w-full max-w-[440px] border"
      >
        <h3 className="text-lg font-semibold mb-2">
          {format(new Date(year, month), "MMMM yyyy")}
        </h3>
        <div className="grid grid-cols-7 gap-1 w-full">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium p-1">
              {day}
            </div>
          ))}
          {calendarDays.map((day) => {
            const isCurrentMonth = getMonth(day) === month;
            const isLeave = leaveDays.some((leaveDay) =>
              isSameDay(day, leaveDay)
            );
            return (
              <div
                key={format(day, "yyyy-MM-dd")}
                className={`text-center p-1 ${
                  isLeave ? "bg-blue-400" : "bg-transparent"
                } ${isCurrentMonth ? "" : "text-gray-500"} border text-sm`}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[440px] mx-auto">
      {loading ? (
        <Skeleton className="w-full h-[250px]" />
      ) : (
        renderDashboard(selectedYear, selectedMonth)
      )}
    </div>
  );
};

export default LeaveCalendar;
