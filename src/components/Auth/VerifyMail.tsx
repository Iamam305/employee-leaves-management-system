"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const VerifyMail = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [otp, setOtp] = useState<string>("");
  const [userInput, setUserInput] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    const enteredOTP = userInput.join("");
    setOtp(enteredOTP);
  }, [userInput]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newUserInput = [...userInput];
      newUserInput[index] = value;
      setUserInput(newUserInput);
      if (value.length === 1 && index < 5) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && index > 0 && userInput[index] === "") {
      inputRefs[index - 1].current?.focus();
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await axios.post("/api/verify-email", {
        verification_code: otp,
        user_id: userId,
      });
      if (typeof response.data.msg === "string") {
        toast.success(response.data.msg);
      } else {
        toast.success("Verification successful");
      }
      console.log("data: ", response.data);
      setIsVerified(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.msg || "An error occurred during verification"
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="mb-4 text-2xl font-bold text-center">One Time Password</h1>
      <div className="mb-4 flex justify-center space-x-2">
        {userInput.map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center text-2xl border"
            value={userInput[index]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={inputRefs[index]}
          />
        ))}
      </div>
      <div className="mb-4">
        <p className="text-sm text-center">
          Please enter the one-time password sent to your phone
        </p>
      </div>
      <div className="mb-4">
        <Button className="w-full" onClick={verifyOTP}>
          Submit
        </Button>
      </div>
      {isVerified && (
        <p className="text-green-600 font-semibold">
          OTP Verified Successfully!
        </p>
      )}
    </div>
  );
};

// Define the Suspense boundary component
const VerifyEmailPage: React.FC = ({ children }: any) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <VerifyMail />
    </React.Suspense>
  );
};

export default VerifyEmailPage;
