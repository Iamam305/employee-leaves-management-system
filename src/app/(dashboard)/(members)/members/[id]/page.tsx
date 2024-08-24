"use client";
import UserDashboard from "@/components/Employee/UserDashboard";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const SingleMember = () => {
  const user_role = useSelector(
    (state: any) => state.membership.memberShipData?.role
  );

  const router = useRouter();

  const params = useParams();
  const employee_id = params.id;

  console.log("Employee Id==>", employee_id);

  useEffect(() => {
    user_role === "employee" ? router.push("/members") : null;
  }, [user_role]);

  return (
    <div>
      <UserDashboard id={employee_id} />
    </div>
  );
};

export default SingleMember;
