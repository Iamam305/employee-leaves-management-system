"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";
import LeaveTypeModal from "@/components/leaves/LeaveTypeModal";
// import { ClientTableProps } from "@/lib/types";

export const LeaveTypeTableClient: React.FC<any> = ({
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
  fetchData,
}) => {
  // console.log('fetch data' , fetchData)
  return (
    <>
      <div className="flex items-start justify-between   ">
        <Heading
          title={`All Leaves Types`}
          description="All Leave Types Created By Hr or Admin"
        />
        <LeaveTypeModal title="Add Leave Type" fetchData={fetchData}/>
      </div>
      <Separator />
      <DataTable
        searchKey=""
        columns={columns(fetchData)}
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
