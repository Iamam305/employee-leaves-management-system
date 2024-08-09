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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  isLoading: boolean;
  page?: number;
  setPage?: any;
  totalPage?: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  isLoading,
  page,
  setPage,
  totalPage,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <div className="flex flex-col space-y-4  md:w-full w-[85vw]">
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
      {page ? (
        <div className="text-sm text-muted-foreground flex items-center gap-3">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage(page - 1);
                router.push(`${pathname}?page=${page - 1}`);
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
                router.push(`${pathname}?page=${page + 1}`);
              }}
              disabled={page == totalPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <span className="text-sm">
              {`Page  ${page} of ${totalPage || 2}`}
            </span>
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
      )}
    </div>
  );
}
