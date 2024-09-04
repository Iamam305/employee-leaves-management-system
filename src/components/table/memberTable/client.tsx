"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, PlusIcon } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";
import { columns } from "./columns";
import InviteMembers from "@/components/Invitations/InviteMember";
import { useSelector } from "react-redux";
import AssignManager from "@/components/dashboard/AssignManager";

export const MemberTableClient: React.FC<any> = ({
  data,
  isLoading,
  name,
  setName,
  orgs,
  setOrgs,
  setOrgId,
  page,
  setPage,
  totalPage,
  current_user_role,
  managers,
  type,
  managerId,
  setManagerId
}) => {
  const user_role = useSelector(
    (state: any) => state.membership.memberShipData?.role
  );

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-start justify-between space-y-4 md:space-y-0 md:space-x-4">
        <Heading title="All Members" description="All Members Details" />
        <div className="flex flex-wrap gap-4 md:flex-row md:space-x-4">
          {user_role === "hr" || user_role === "admin" ? (
            <AssignManager />
          ) : null}
          {user_role === "hr" || user_role === "admin" ? (
            <InviteMembers />
          ) : null}
        </div>
      </div>
      <Separator />
      <DataTable
        searchKey=""
        columns={columns(current_user_role)}
        data={data}
        isLoading={isLoading}
        name={name}
        setManagerId={setManagerId}
        managers={managers}
        setName={setName}
        orgs={orgs}
        setOrgs={setOrgs}
        setOrgId={setOrgId}
        setPage={setPage}
        type = {type}
        page={page}
        managerId={managerId}
        totalPage={totalPage}
      />
    </>
  );
};
