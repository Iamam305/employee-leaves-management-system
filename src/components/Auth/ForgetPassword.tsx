"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ForgetPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    try {
      const response = await axios.post("/api/forgot-password", {
        email,
      });
      if (response.data) {
        toast.success(response.data.msg);
      }

      router.push(`/notification?value=${"password reset email"}&email=${email}`);

      console.log(response.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.msg || "An error occurred while sending email"
      );
    }
  };

  return (
    <div className="md:w-5/12 w-10/12 mx-auto mt-10">
      <div>
        <h1 className="text-2xl font-bold text-center">Forget Password</h1>
        <p className="text-gray-600 mt-2 text-center">
          Forget your password? Enter your email to reset your password.
        </p>
      </div>
      <form className="space-y-8 mt-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border rounded p-2"
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
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
  );
};

export default ForgetPassword;
