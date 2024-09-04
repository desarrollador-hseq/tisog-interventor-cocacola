"use client";

import { useRef, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Clock,
  Eye,
  GraduationCap,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import TableColumnFiltering from "@/components/table-column-filtering";

import { toast } from "sonner";

import axios from "axios";
import { useRouter } from "next/navigation";
import { TablePagination } from "@/components/table-pagination";
import { TableToExcel } from "@/components/table-to-excel";
import { cn, shouldControlBeManaged } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] &
    {
      date?: Date | null;
    }[];
  editHref?: { btnText: string; href: string };
  deleteHref?: string;
  nameDocument?: string;
}

export function ControlTable<TData, TValue>({
  data,
  columns,
  editHref,
  deleteHref,
  nameDocument,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [filtering, setFiltering] = useState("");

  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId: (row: any) => row.id,
    onGlobalFilterChange: setFiltering,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: filtering,
    },
  });

  const onAceptDelete = async (id: string) => {
    setisLoading(true);
    try {
      await axios.delete(`${deleteHref}/${id}`);
      toast.success("Elemento eliminado");
      // router.push("/admin/herramientas/");
      // router.refresh()
    } catch (error) {
      toast.error("ocurrió un error al momento de eliminar el elemento");
    } finally {
      router.refresh();
      setisLoading(false);
    }
  };

  const beManaged = (date?: string | null) => {
    const isManaged = !!date && shouldControlBeManaged(date);
    return isManaged;
  };

  return (
    <div className="w-full">
      <div className="rounded-md border border-input overflow-hidden">
        <Table className="bg-white">
          <TableHeader className="bg-slate-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-bg-slate-300 hover:bg-bg-slate-300"
              >
                <TableHead />
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="py-2 text- bg-slate-300"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanFilter() ? (
                        <div
                          className=" flex flex-col justify-around "
                          id="non-print"
                        >
                          <TableColumnFiltering
                            column={header.column}
                            table={table}
                          />
                        </div>
                      ) : (
                        <div className="h-6"></div>
                      )}
                    </TableHead>
                  );
                })}
                <TableHead />
                <TableHead />
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id + index}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "text-slate-900",
                    beManaged(row.original.date)
                      ? "bg-blue-50 hover:bg-blue-100"
                      : "bg-slate-200 hover:bg-slate-400"
                  )}
                >
                  <TableCell>
                    {beManaged(row.original.date) && (
                      <Clock className="w-3 h-3 animate-spin text-primary" />
                    )}
                  </TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}

                  {!!editHref && (
                    <TableCell>
                      <Link
                        className={cn(
                          "flex justify-center ",
                          buttonVariants({
                            className: cn(
                              "p-2 h-fit",
                              beManaged(row.original.date)
                                ? "bg-slate-400 hover:bg-slate-500 shadow-lg border-2"
                                : "bg-blue-400 hover:bg-blue-500"
                            ),
                          })
                        )}
                        href={`${editHref.href}/${row.original.id}`}
                      >
                        {beManaged(row.original.date) ? (
                          <Pencil className="w-4 h-4 animate-pulse" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Link>
                    </TableCell>
                  )}
                  <TableCell />
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-1 py-2">
        <TablePagination table={table} />
      </div>
      {!!nameDocument && <TableToExcel table={table} name={nameDocument} />}
    </div>
  );
}
