"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FindingReport, User } from "@prisma/client";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const findingReportTableColumns: ColumnDef<FindingReport>[] = [
  {
    accessorKey: "name",
    accessorFn: (value) => value.securityQuestionId,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Nombre completo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original?.securityQuestionId;
      return <div className="">{name}</div>;
    },
  },
  {
    accessorKey: "nit",
    accessorFn: (value) => value.securityQuestionId,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Documento
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const numDoc = row.original?.securityQuestionId;
      return <div className="">{numDoc}</div>;
    },
  },
  // {
  //   accessorKey: "contractor",
  //   accessorFn: (value) => value.contractor?.name,
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
  //       >
  //         Contratista
  //         <ArrowUpDown className="ml-2 h-3 w-3" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const name = row.original?.contractor?.name;
  //     return <div className="">{name}</div>;
  //   },
  // },
];
