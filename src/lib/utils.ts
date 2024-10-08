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

export const getMonth = (date:Date) => {
  const Cdate = dayjs(date);
  return Cdate.month();
}

export const getYear = (date:Date) => {
  const Cdate = dayjs(date);
  return Cdate.year();
}

