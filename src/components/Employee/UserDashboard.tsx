"use client";
import React, { useEffect, useState } from "react";
import { format, eachDayOfInterval, isSameDay, getYear, getMonth, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from "date-fns";
import axios from "axios";

const UserDashboard = () => {
  const [leavePeriods, setLeavePeriods] = useState<any[]>([]);
  const leaveDays = leavePeriods.flatMap(({ start, end }) =>
    eachDayOfInterval({ start: new Date(start), end: new Date(end) })
  );

  console.log("Leave Days==> ", leaveDays);

  const getLeavesDetails = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/org/get-members/66b5e16b725dba994dc40f7d`
      );
      console.log("Data===> ", data.leaves[0]?.leaves);
      setLeavePeriods(data.leaves[0]?.leaves || []);
    } catch (error) {
      console.error("Error fetching leave details:", error);
    }
  };

  useEffect(() => {
    getLeavesDetails();
  }, []);

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
      <div key={`${month}-${year}`} className=" p-1 flex flex-col items-center justify-center h-max-content border ">
        <h3>{format(new Date(year, month), "MMMM yyyy")}</h3>
        <div className="flex flex-wrap" style={{ width: "440px" }}>
          <div className="flex w-full mb-2">
            {weekDays.map(day => (
              <div
                key={day}
                className="text-center"
                style={{ width: `${cellWidth}px`, height: "30px" }}
              >
                {day}
              </div>
            ))}
          </div>
          {calendarDays.map(day => {
            const isCurrentMonth = getMonth(day) === month;
            const isLeave = leaveDays.some(leaveDay =>
              isSameDay(day, leaveDay)
            );
            return (
              <div
                key={format(day, "yyyy-MM-dd")}
                className={`text-center mt-2 ${isLeave ? "bg-blue-400" : "bg-transparent"} ${isCurrentMonth ? "" : "text-gray-300"} border `}
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

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(event.target.value));
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value));
  };

  return (
    <div>
      {/* <div>
        <label htmlFor="month-select">Select Month: </label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <option key={index} value={index}>
              {format(new Date(currentYear, index), "MMMM")}
            </option>
          ))}
        </select>
        <label htmlFor="year-select"> Select Year: </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div> */}
      {renderDashboard(selectedYear, selectedMonth)}
      <div>
        {/* <p>
          Leave periods:
          <br />
          {leavePeriods.map(({ start, end }) => (
            <span key={`${format(start, "yyyy-MM-dd")}`}>
              {format(new Date(start), "dd MMM yyyy")} to {format(new Date(end), "dd MMM yyyy")}
              <br />
            </span>
          ))}
        </p> */}
      </div>
    </div>
  );
};

export default UserDashboard;