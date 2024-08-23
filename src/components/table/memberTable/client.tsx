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
}) => {
  const user_role = useSelector(
    (state: any) => state.membership.memberShipData?.role
  );

  return (
    <>
      <div className="flex items-start justify-between   ">
        <Heading title={`All Members`} description="All Members Details" />
        {/* <Link href={"/members/invite-members"}> */}
        {user_role !== "employee" && <InviteMembers />}
        {/* </Link> */}
      </div>
      <Separator />
      <DataTable
        searchKey=""
        columns={columns(current_user_role)}
        data={data}
        isLoading={isLoading}
        name={name}
        setName={setName}
        orgs={orgs}
        setOrgs={setOrgs}
        setOrgId={setOrgId}
        setPage={setPage}
        page={page}
        totalPage={totalPage}
      />
    </>
  );
};
