"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Accidents, User } from "@prisma/client";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const accidentTableColumns: ColumnDef<
  Accidents & {
    contractor: { name: string | null } | null;
    area: { name: string | null } | null;
  }
>[] = [
  {
    accessorKey: "type",
    accessorFn: (value) => value.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const typedb = row.original?.type;
      const type = typedb === "ACCIDENT" ? "Accidente" : "Incidente";
      return <div className="">{type}</div>;
    },
  },
  {
    accessorKey: "contractor",
    accessorFn: (value) => value.contractor?.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Contratista
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const numDoc = row.original?.contractor?.name;
      return <div className="">{numDoc}</div>;
    },
  },
  {
    accessorKey: "area",
    accessorFn: (value) => !!value.area?.name ? value.area.name : "Sin área",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Área
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const numDoc = row.original?.area?.name ||  "Sin área";
      return <div className="">{numDoc}</div>;
    },
  },
  {
    accessorKey: "contractor",
    accessorFn: (value) => value.contractor?.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Contratista
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original?.contractor?.name;
      return <div className="">{name}</div>;
    },
  },
];
