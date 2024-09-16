import React from "react";
import { Calendar, Users, FileText, Bell } from "lucide-react";
import Image from "next/image";
import { AnimatedSquareBackground } from "./Animation";
import { Separator } from "../ui/separator";
import Features from "./Features";
import { Button } from "../ui/button";

const LandingPage = () => {
  const roles = [
    {
      title: "Admin",
      description: "Create organizations and manage system-wide settings.",
    },
    {
      title: "HR",
      description: "Manage employee profiles and configure leave policies.",
    },
    {
      title: "Manager",
      description: "Approve leave requests and view team calendars.",
    },
    {
      title: "Employee",
      description: "Submit leave requests and view leave balances.",
    },
  ];

  return (
    <>
      <div className="relative min-h-screen bg-n-8 text-white overflow-hidden">
        <div className="relative z-10">
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <section className="text-center mb-16  relative flex flex-col gap-5 items-center justify-center">
              <h1 className="text-6xl h-[10vh] sm:text-6xl font-extrabold mb-4 bg-gradient-to-l from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Leave Management System
              </h1>
              <p className="text-xl">
                Streamline your organizations leave management process
              </p>
              <p className="text-xl mb-8">
                Our Leave Management System helps organizations efficiently
                manage employee leaves, approvals, and related processes across
                different roles.
              </p>
              <Button className="bg-green-600 text-white py-3 w-[20%] px-8 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
                Get Started
              </Button>
              <div className="relative w-full mx-auto">
                <Image
                  src="/dashboard.png"
                  alt="dashboard"
                  width={100}
                  height={675}
                  layout="responsive"
                  className="rounded-lg shadow-2xl w-full h-full"
                />
              </div>
            </section>

            <Separator />

            <section className="mb-0 mt-10">
              <Features />
              {/* <h2 className="text-3xl font-bold mb-8 text-center">
                Key Features
              </h2> */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg text-center"
                  >
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                ))}
              </div> */}
            </section>

            <Separator className=" mt-10" />

            <section className=" mt-10 mb-10 relative">
              {/* <AnimatedSquareBackground/> */}
              <h2 className="text-3xl font-bold mb-8 text-center">
                User Roles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {roles.map((role, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                  >
                    <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                    <p className="text-gray-300">{role.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>

          <footer className="bg-gray-800 text-white py-6 text-center mt-16">
            <p>&copy; 2024 Leave Management System. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
