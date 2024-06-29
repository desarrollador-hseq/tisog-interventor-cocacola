"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Contractor } from "@prisma/client";

export const contractorTableColumns: ColumnDef<
  Contractor & { city: { realName: string | null } | null }
>[] = [
  {
    accessorKey: "name",
    accessorFn: (value) => value.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Razón social
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original?.name;
      return <div className="">{name}</div>;
    },
  },
  {
    accessorKey: "nit",
    accessorFn: (value) => value.nit,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          NIT
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const nit = row.original?.nit;
      return <div className="">{nit}</div>;
    },
  },
  // {
  //   accessorKey: "city",
  //   accessorFn: (value) => value.name,
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
  //       >
  //         Ciudad
  //         <ArrowUpDown className="ml-2 h-3 w-3" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const name = row.original?.city?.realName;
  //     return <div className="">{name}</div>;
  //   },
  // },
];
