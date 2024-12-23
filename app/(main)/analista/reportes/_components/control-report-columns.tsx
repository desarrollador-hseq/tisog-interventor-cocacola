"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, formatDate } from "date-fns";
import { es } from "date-fns/locale";
import { BusinessAreas, ControlReport } from "@prisma/client";

const sourceOptions = [
  { value: "inspeccion", label: "Inspección" },
  { value: "inspeccion-preoperacional", label: "Insp. Preoperacional" },
  {
    value: "reporte-condicion-insegura",
    label: "Reporte de condiciones inseguras",
  },
  { value: "reporte-acto-inseguro", label: "Reporte de actos inseguros" },
  { value: "observacion-en-campo", label: "Observaciones en campo" },
  { value: "sugerencia", label: "Sugerencia" },
];

export const controlReportColumns: ColumnDef<
  ControlReport & {
    businessArea?: { name?: string | null } | null;
    contractor?: { name?: string | null } | null;
    findingReport?: { id?: string | null }[] | null;
  }
>[] = [
  {
    accessorKey: "description",
    accessorFn: (row) => row.description,
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
      <div className=" truncate">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "area",
    accessorFn: (value) => value.businessArea?.name,
    enableColumnFilter: false,

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Área
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const turn = row.original?.businessArea?.name;
      return <div className="">{turn}</div>;
    },
  },
  {
    accessorKey: "contractor",
    accessorFn: (value) => value.contractor?.name,
    enableColumnFilter: false,

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Contratista
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const turn = row.original?.contractor?.name;
      return <div className="">{turn}</div>;
    },
  },
  {
    accessorKey: "date",
    enableColumnFilter: true,
    accessorFn: (value) => value.createdAt ? format(value.createdAt, "P", { locale: es }) : "--",
    enableSorting: false,
    maxSize: 100,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original?.createdAt;
      return (
        <div className="">
          {date ? format(date, "P", { locale: es }) : "sin datos"}
        </div>
      );
    },
  },
  {
    accessorKey: "findingReport",
    enableColumnFilter: false,
    accessorFn: (value) => value.findingReport?.length,
    maxSize: 100,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          # de hallazgos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.findingReport?.length;
      return <div className="">{date}</div>;
    },
  },
];
