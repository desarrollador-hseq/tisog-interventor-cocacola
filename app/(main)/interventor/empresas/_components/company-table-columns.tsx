


"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Company } from "@prisma/client";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";



export const companyTableColumns: ColumnDef<Company & {city: {realName: string | null} | null}>[] =
  [
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
            Nombre completo
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
      accessorKey: "city",
      accessorFn: (value) => value.name,
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
        const name = row.original?.city?.realName;
        return <div className="">{name}</div>;
      },
    },

  ];

