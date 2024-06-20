"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ControlReport, FindingReport } from "@prisma/client";

const selectOptions = [
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

export const findingReportColumns: ColumnDef<
  FindingReport & {
    controlReport:
      | (ControlReport & { businessArea: { name: string | null } })
      | null;
  }
>[] = [
  {
    accessorKey: "businessArea",
    accessorFn: (value) => value.controlReport?.businessArea.name,
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
      const turn = row.original?.controlReport?.businessArea.name;
      return <div className="">{turn}</div>;
    },
  },
  {
    accessorKey: "id",
    accessorFn: (value) => value.id,
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
      const turn = row.original?.id
      return <div className="">{turn}</div>;
    },
  },
  {
    accessorKey: "date",
    enableColumnFilter: false,
    accessorFn: (value) =>
      value.createdAt ? format(value.createdAt, "P", { locale: es }) : "",
    maxSize: 100,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Fecha de creación
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original?.createdAt;
      const dateFormated = row.original?.createdAt
        ? format(row.original?.createdAt, "P", { locale: es })
        : "";
      return <div className="capitalize">{dateFormated}</div>;
    },
  },
  {
    accessorKey: "source",
    accessorFn: (value) => value.controlReport?.source,
    enableColumnFilter: false,

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Fuente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const turn = row.original?.controlReport?.source;
      const sourceEsp = selectOptions.find(d => d.value === turn);
      return <div className="capitalize">{sourceEsp ? sourceEsp.label : ""}</div>;
    },
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
      <div className="capitalize truncate">
        {row.getValue("taskDescription")}
      </div>
    ),
  },

 
];
