import { useRef } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { formatDate } from "date-fns";
import { flexRender } from "@tanstack/react-table";
import { FileDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export const TableToExcel = ({ table, name }: { table: any; name: string }) => {
  const tableRef = useRef(null);

  return (
    <>
      <Table ref={tableRef} className="hidden">
        <TableHeader className="bg-slate-300">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow
              key={headerGroup.id}
              className="bg-slate-300 hover:bg-slate-300"
            >
              {headerGroup.headers.map((header: any) => (
                <TableHead key={header.id} className="py-2 text- bg-slate-300">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
              <TableHead />
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getFilteredRowModel().rows.length &&
            table.getFilteredRowModel().rows.map((row: any, index: any) => (
              <TableRow
                key={row.id + index}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getAllCells().map((cell: any) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {table.getRowModel().rows.length > 0 && (
        <div className="non-print flex items-center justify-between space-x-2 py-4">
          <div>
            <DownloadTableExcel
              filename={`${name}-${formatDate(new Date(), "dd-MM-yyyy")}`}
              sheet={`${name ? name : "hoja1"}`}
              currentTableRef={tableRef.current}
            >
              <Button className="bg-slate-200 rounded-full hover:text-white">
                <FileDown className="w-6 h-6 text-secondary hover:text-white" />
              </Button>
            </DownloadTableExcel>
          </div>
        </div>
      )}
    </>
  );
};
