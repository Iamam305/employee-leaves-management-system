"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [orgName, setOrgName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post("/api/register", {
        user_name: userName,
        email,
        password,
        org_name: orgName,
      });
      toast.success("Email Sent Successfully");
      console.log("Registration successful", response.data);
      setSuccess(true);
      router.push("/verify-mail");
    } catch (error: any) {
      toast.error(error.response.data.msg || "An error occurred during login");
      console.error("Registration error", error);
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isPasswordStrong = (password: string) => {
    return password.length >= 8;
  };

  return (
    <div className="md:w-[55%] w-[100%] h-full flex  flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && (
          <div className="text-green-500 mb-4">Registration successful!</div>
        )}

        <div className="mb-2 mt-2">
          <label htmlFor="orgName" className="block mb-2">
            Organization Name
          </label>
          <input
            type="text"
            id="orgName"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-2 mt-2">
          <label htmlFor="userName" className="block mb-2">
            User Name
          </label>
          <input
            type="text"
            id="orgName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-2 mt-2">
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border rounded ${
              !isEmailValid(email) && email ? "border-red-500" : ""
            }`}
            required
          />
          {!isEmailValid(email) && email && (
            <p className="text-red-500 text-sm mt-1">
              Please enter a valid email address
            </p>
          )}
        </div>
        <div className="mb-2 mt-2">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 border rounded ${
              !isPasswordStrong(password) && password ? "border-red-500" : ""
            }`}
            required
          />
          {!isPasswordStrong(password) && password && (
            <p className="text-red-500 text-sm mt-1">
              Password must be at least 8 characters long
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-3"
          disabled={
            loading || !isEmailValid(email) || !isPasswordStrong(password)
          }
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>

        <h1 className="w-full text-end mt-2">
        Click here to
        <Link href="/login">
          <span className="text-blue-500"> Login</span>
        </Link>
      </h1>

      </form>
      
    </div>
  );
};

export default Register;
