"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ControlReport } from "@prisma/client";



export const controlReportColumns: ColumnDef<ControlReport>[] = [
  {
    accessorKey: "workArea",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Lugar
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("workArea")}</div>,
  },
  {
    accessorKey: "taskDescription",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Descripción
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize truncate">{row.getValue("taskDescription")}</div>
    ),
  },
  {
    accessorKey: "turn",
    accessorFn: (value) => value.controlReportId,
    enableColumnFilter: false,

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Turno
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const turn = row.original?.controlReportId;
      return <div className="capitalize">{turn}</div>;
    },
  },
  {
    accessorKey: "date",
    enableColumnFilter: false,
    accessorFn: (value) => value.createdAt ? format(value.createdAt, "P", { locale: es }) : "",
    maxSize: 100,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Fecha de ejecución
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original?.createdAt;
      const dateFormated =  row.original?.createdAt ? format( row.original?.createdAt, "P", { locale: es }) : "";
      return <div className="capitalize">{dateFormated}</div>;
    },
  },
];
