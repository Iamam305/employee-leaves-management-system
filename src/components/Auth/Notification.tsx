"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const NotificationComponent = () => {
  const searchParams = useSearchParams();
  const value = searchParams.get("value");
  const email = searchParams.get("email");

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white  p-8 max-w-md w-full">
          <div className="text-center">
            {/* <Image src={""} alt="LOGO" height={200} width={200} className=" text-black"/> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className=" w-[50%] m-auto"
              fill="none"
              viewBox="0 0 283 64"
            >
              <path
                fill="black"
                d="M141 16c-11 0-19 7-19 18s9 18 20 18c7 0 13-3 16-7l-7-5c-2 3-6 4-9 4-5 0-9-3-10-7h28v-3c0-11-8-18-19-18zm-9 15c1-4 4-7 9-7s8 3 9 7h-18zm117-15c-11 0-19 7-19 18s9 18 20 18c6 0 12-3 16-7l-8-5c-2 3-5 4-8 4-5 0-9-3-11-7h28l1-3c0-11-8-18-19-18zm-10 15c2-4 5-7 10-7s8 3 9 7h-19zm-39 3c0 6 4 10 10 10 4 0 7-2 9-5l8 5c-3 5-9 8-17 8-11 0-19-7-19-18s8-18 19-18c8 0 14 3 17 8l-8 5c-2-3-5-5-9-5-6 0-10 4-10 10zm83-29v46h-9V5h9zM37 0l37 64H0L37 0zm92 5-27 48L74 5h10l18 30 17-30h10zm59 12v10l-3-1c-6 0-10 4-10 10v15h-9V17h9v9c0-5 6-9 13-9z"
              />
            </svg>
            <h1 className="text-2xl font-bold mt-4">
              <span className=" capitalize">{value}</span> Sent!
            </h1>
            <p className="text-gray-600 mt-2">
              <span className=" capitalize">{value}</span> has been sent to{" "}
              {email}
              <span className="font-medium"></span>. Please check your email and
              follow the instructions to
              {value === "password reset email"
                ? " reset the password"
                : " verify your account"}
              .
            </p>
          </div>
          <div className="mt-6">
            <Link href="/login">
              <Button className="w-full">Back to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const Notification: React.FC = ({ children }: any) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <NotificationComponent />
    </React.Suspense>
  );
};

export default Notification;
