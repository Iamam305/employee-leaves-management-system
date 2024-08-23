import { Balances } from "@/models/balanceCredits.model";
import { LeaveType } from "@/models/leave-type.model";
import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const debounce = (func: any, delay: any) => {
  let timeoutId: any;
  return (...args: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const FormateDate = (date: Date) => {
  const convertedDate = dayjs(date).format("DD/MM/YYYY");
  return convertedDate;
};

export const getDays = (startdate: Date, enddate: Date) => {
  const start = dayjs(startdate);
  const end = dayjs(enddate);
  return end.diff(start, "days") + 1;
};

export const initializeEmployeeBalance = async (userId: string, year: any) => {
  const leaveTypes = await LeaveType.find();

  const leaveBalances: any = leaveTypes.reduce((acc, leaveType) => {
    acc[leaveType.name] = {
      credit: 0,
      used: 0,
      available: 0,
    };
    return acc;
  }, {});

  const balance = new Balances({
    userId,
    year,
    leaveBalances,
  });

  await balance.save();
  return balance;
};

export const updateEmployeeBalance = async (
  userId: string,
  year: any,
  leaveTypeName: string,
  credit: number
) => {
  const balance: any = await Balances.findOne({ userId, year });

  if (!balance) {
    throw new Error("Balance not found for the specified user and year");
  }

  if (!balance.leaveBalances.has(leaveTypeName)) {
    throw new Error(`Leave type ${leaveTypeName} not found for the user`);
  }

  balance.leaveBalances.set(leaveTypeName, {
    credit,
    used: balance.leaveBalances.get(leaveTypeName).used,
    available: credit - balance.leaveBalances.get(leaveTypeName).used,
  });

  await balance.save();
  return balance;
};

export const addNewLeaveTypeToAllEmployees = async (leaveTypeName: any) => {
  const employees = await Balances.find();

  for (const employee of employees) {
    if (!employee.leaveBalances.has(leaveTypeName)) {
      employee.leaveBalances.set(leaveTypeName, {
        credit: 0,
        used: 0,
        available: 0,
      });
      await employee.save();
    }
  }
};

export const calculateAndUpdateBalances = async (
  userId: string,
  year: any,
  leaveTypeName: string,
  days: number
) => {
  // Find the balance record for the specific user and year
  const balance = await Balances.findOne({ userId, year });

  if (!balance) {
    throw new Error("Balance not found for the specified user and year");
  }

  // Check if the leave type exists in the user's balance record
  if (!balance.leaveBalances.has(leaveTypeName)) {
    throw new Error(`Leave type ${leaveTypeName} not found for the user`);
  }

  // Get the current balance for the specified leave type
  const currentBalance: any = balance.leaveBalances.get(leaveTypeName);

  // Calculate the updated balance
  const updatedUsed = currentBalance.used + days;
  const updatedAvailable = currentBalance.credit - updatedUsed;

  // Update the balance in the map
  balance.leaveBalances.set(leaveTypeName, {
    credit: currentBalance.credit,
    used: updatedUsed,
    available: updatedAvailable,
  });

  // Save the updated balance record
  await balance.save();

  return balance;
};
