"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const ChangePassword = () => {
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const user_id = searchParams.get("userId");
  const validatePassword: any = (password: string) => {
    return password.length >= 8;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setPasswordError("Please enter a valid email address");
      return;
    }
    setPasswordError("");
    try {
      const response = await axios.patch("/api/forgot-password", {
        user_id,
        password,
      });
      if (response.data) {
        toast.success(response.data.msg);
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.msg || "An error occurred while sending email"
      );
    }
  };

  return (
    <>
      <div className="md:w-5/12 w-10/12 mx-auto mt-10">
        <div>
          <h1 className="text-2xl font-bold text-center">New Password</h1>
          <p className="text-gray-600 mt-2 text-center">
            Enter your new password.
          </p>
        </div>
        <form className="space-y-8 mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              className="border rounded p-2"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
        <div className="w-full text-end mt-2">
          Click here to
          <Link href="/register">
            <span className="text-blue-500"> Register</span>
          </Link>
        </div>
      </div>
    </>
  );
};

const ChangePasswordPage: React.FC = ({ children }: any) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ChangePassword />
    </React.Suspense>
  );
};

export default ChangePasswordPage;
