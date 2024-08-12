"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";
// import { ClientTableProps } from "@/lib/types";

export const LeaveTableClient: React.FC<any> = ({
  data,
  isLoading,
  fetchdata
  // page,
  // setPage,
  // totalPage,
}) => {
  return (
    <>
      <div className="flex items-start justify-between   ">
        <Heading
          title={`All Leaves`}
          description="All Leave Request Raised by Users"
        />
      </div>
      <Separator />
      <DataTable
        searchKey=""
        columns={columns(fetchdata)}
        data={data}
        isLoading={isLoading}
        // setPage={setPage}
        // page={page}
        // totalPage={totalPage}
      />
    </>
  );
};
