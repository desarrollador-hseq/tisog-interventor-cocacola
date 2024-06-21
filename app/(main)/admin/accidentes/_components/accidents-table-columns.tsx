"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Accidents, User } from "@prisma/client";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const accidentTableColumns: ColumnDef<Accidents>[] = [
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
      const type = typedb === "ACCIDENT" ? "Accidente" : "Incidente"
      return <div className="">{type }</div>;
    },
  },
  {
    accessorKey: "nit",
    accessorFn: (value) => value.numDoc,
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
      const numDoc = row.original?.numDoc;
      return <div className="">{numDoc}</div>;
    },
  },
  {
    accessorKey: "email",
    accessorFn: (value) => value.email,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Correo electrónico
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const numDoc = row.original?.email;
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
