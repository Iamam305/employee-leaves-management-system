"use client";
import UserDashboard from "@/components/Employee/UserDashboard";
import { useParams } from "next/navigation";
import React from "react";

const SingleMember = () => {
  const params = useParams();
  const employee_id = params.id;

  console.log("Employee Id==>", employee_id);

  return (
    <div>
      <UserDashboard id={employee_id} />
    </div>
  );
};

export default SingleMember;
