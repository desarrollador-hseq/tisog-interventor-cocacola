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
      | (ControlReport & {
          businessArea: { name: string | null } | null;
          contractor: { name: string | null } | null;
          controller: { name: string | null } | null;
        })
      | null;
  }
>[] = [
  {
    accessorKey: "businessArea",
    accessorFn: (value) => value.controlReport?.businessArea?.name,
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
      const turn = row.original?.controlReport?.businessArea?.name;
      return <div className="">{turn}</div>;
    },
  },
  {
    accessorKey: "contractor",
    accessorFn: (value) => value.controlReport?.contractor?.name,
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
      const turn = row.original?.controlReport?.contractor?.name;
      return <div className="">{turn}</div>;
    },
  },
  {
    accessorKey: "interventor",
    accessorFn: (value) => value.controlReport?.controller?.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Interventor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const turn =
        row.original?.controlReport?.controller?.name || "No asignado";

      return <div className="">{turn}</div>;
    },
  },
  {
    accessorKey: "date",
    enableColumnFilter: false,
    accessorFn: (value) =>
      value.controlReport?.date
        ? format(value.controlReport?.date, "P", { locale: es })
        : "",
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
      const date = row.original?.controlReport?.date;
      const dateFormated = row.original?.controlReport?.date
        ? format(row.original?.controlReport?.date, "P", { locale: es })
        : "";
      return <div className="">{dateFormated}</div>;
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
      const sourceEsp = selectOptions.find((d) => d.value === turn);
      return (
        <div className="capitalize">{sourceEsp ? sourceEsp.label : ""}</div>
      );
    },
  },
  {
    accessorKey: "findingLevel",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Criticidad
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const level = row.original?.findingLevel;
      const sourceEsp =
        level === "HIGH" ? (
          <span className="px-2 h-fit bg-red-600 text-white rounded-md">
            ALTA
          </span>
        ) : level === "MEDIUM" ? (
          <span className="px-2 h-fit bg-yellow-600 text-white rounded-md">
            MEDIA
          </span>
        ) : (
          <span className="px-2 h-fit bg-slate-500 text-white rounded-md">
            BAJA
          </span>
        );
      return sourceEsp;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground"
        >
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const level = row.original?.status;
      const sourceEsp =
        level === "OPEN" ? (
          <span className="px-2 h-fit ">Abierto</span>
        ) : (
          <span className="px-2 h-fit">Cerrado</span>
        );
      return sourceEsp;
    },
  },
];
