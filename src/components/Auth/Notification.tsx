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
            <h1 className=" text-4xl font-extrabold">MW LEAVES</h1>
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
