"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { Skeleton } from "./skeleton";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  isLoading: boolean;
  page?: any;
  setPage?: any;
  totalPage?: any;
  name?: string;
  setName?: any;
  orgs?: any;
  setOrgs?: any;
  setOrgId?: any;
  managers?: any;
  type?: string;
  managerId?: string;
  setManagerId?: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  isLoading,
  page,
  setPage,
  totalPage,
  name,
  setName,
  orgs,
  setOrgs,
  setOrgId,
  managers,
  type,
  managerId,
  setManagerId,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnFilters: true,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  const current_user = useSelector(
    (state: any) => state.membership.memberShipData
  );

  const handleManagerChange = (manager: any) => {
    if (manager === "none") {
      setManagerId("");
    } else {
      setManagerId(manager);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4  md:w-full w-[85vw]">
        {(name || setName || setOrgId) && (
          <div className="mt-2 flex gap-5">
            <Input
              placeholder="Search users..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-sm"
            />
            {(type === "Members" || type === "Leave") &&
              (current_user.role === "hr" || current_user.role === "admin") && (
                <Select value={managerId} onValueChange={handleManagerChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={"none"}>None</SelectItem>
                      {managers.map((manager: any) => (
                        <SelectItem key={manager._id} value={manager._id}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
          </div>
        )}
        <div className="rounded-md border">
          <ScrollArea className="h-[calc(100vh-300px)] w-full  p-5">
            <Table className="border rel rounded-top-3 w-full ">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="border-b  font-semibold"
                        style={{ width: "350px" }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {table
                          .getHeaderGroups()[0]
                          .headers.map((header, colIndex) => (
                            <TableCell
                              key={`${rowIndex}-${colIndex}`}
                              className="border-b"
                            >
                              <Skeleton className="h-8 w-full" />
                            </TableCell>
                          ))}
                      </TableRow>
                    ))}
                  </>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="border-b">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {Number(totalPage) > 1 && (
          <div className="text-sm text-muted-foreground flex items-center gap-3">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPage(page - 1);
                  // router.push(`${pathname}?page=${page - 1}`);
                }}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPage(page + 1);
                  // router.push(`${pathname}?page=${page + 1}`);
                }}
                disabled={page == totalPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <span className="text-sm">{`Page  ${page} of ${totalPage}`}</span>
            </div>
          </div>
        )}
        {/* {(page as any) > 1 ? (
          <div className="text-sm text-muted-foreground flex items-center gap-3">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPage(page - 1);
                  // router.push(`${pathname}?page=${page - 1}`);
                }}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPage(page + 1);
                  // router.push(`${pathname}?page=${page + 1}`);
                }}
                disabled={page == totalPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <span className="text-sm">{`Page  ${page} of ${totalPage}`}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground flex items-center gap-3">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <span className="text-sm">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
}
