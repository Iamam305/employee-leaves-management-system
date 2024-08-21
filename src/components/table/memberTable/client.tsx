"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, PlusIcon } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";
import { columns } from "./columns";

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
  return (
    <>
      <div className="flex items-start justify-between   ">
        <Heading title={`All Members`} description="All Members Details" />
        <Link href={"/members/invite-members"}>
          <Button className=" flex items-center gap-2">
            <PlusIcon className=" h-4 w-4" />
            Invite Members
          </Button>
        </Link>
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
        setOrgId={  setOrgId}
        setPage={setPage}
        page={page}
        totalPage={totalPage}
      />
    </>
  );
};
