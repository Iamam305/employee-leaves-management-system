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

const LeaveCalendar = () => {
  const [leavePeriods, setLeavePeriods] = useState<any[]>([]);
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

  const getLeavesDetails = async () => {
    try {
      let api_url = `http://localhost:3000/api/org/get-members/66b5e16b725dba994dc40f7d`;

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

    const cellWidth = 440 / 7;

    return (
      <div
        key={`${month}-${year}`}
        className="p-1 flex flex-col items-center justify-center h-max-content border"
      >
        <h3>{format(new Date(year, month), "MMMM yyyy")}</h3>
        <div className="flex flex-wrap" style={{ width: "440px" }}>
          <div className="flex w-full mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center"
                style={{ width: `${cellWidth}px`, height: "30px" }}
              >
                {day}
              </div>
            ))}
          </div>
          {calendarDays.map((day) => {
            const isCurrentMonth = getMonth(day) === month;
            const isLeave = leaveDays.some((leaveDay) =>
              isSameDay(day, leaveDay)
            );
            return (
              <div
                key={format(day, "yyyy-MM-dd")}
                className={`text-center mt-2 ${
                  isLeave ? "bg-blue-400" : "bg-transparent"
                } ${isCurrentMonth ? "" : "text-gray-300"} border`}
                style={{ width: `${cellWidth}px`, height: "30px" }}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const currentDate = new Date();
  const currentYear = getYear(currentDate);
  const currentMonth = getMonth(currentDate);

  const [selectedMonth, setSelectedMonth] = useState(
    month_param ? parseInt(month_param.split("-")[1], 10) - 1 : currentMonth
  );
  const [selectedYear, setSelectedYear] = useState(
    month_param ? parseInt(month_param.split("-")[0], 10) : currentYear
  );

  return <div>{renderDashboard(selectedYear, selectedMonth)}</div>;
};

export default LeaveCalendar;
