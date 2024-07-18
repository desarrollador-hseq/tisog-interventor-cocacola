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
    accessorFn: (value) => {
      return value.type === "ACCIDENT" ? "Accidente" : "Incidente";
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Tipo
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
    accessorFn: (value) => (!!value.area?.name ? value.area.name : "Sin área"),

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
      const numDoc = row.original?.area?.name || "Sin área";
      return <div className="">{numDoc}</div>;
    },
  },
  {
    accessorKey: "source",
    accessorFn: (value) => (value.origin === "ACT" ? "ACTO" : "CONDICIÓN"),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Origen
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original?.origin === "ACT" ? "ACTO" : "CONDICIÓN";
      return <div className="">{name}</div>;
    },
  },
  {
    accessorKey: "classification",
    accessorFn: (value) =>
      value.classification === "FIRST_AID"
        ? "Primeros auxilios"
        : value.classification === "LOST_WORKDAY"
        ? "Incidente, dias perdidos"
        : value.classification === "MEDICAL_TREATMENT"
        ? "Tratamiento medico"
        : value.classification === "NEAR_MISS"
        ? "Near miss"
        : "Desconocido",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Clasificación
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name =
        row.original?.classification === "FIRST_AID"
          ? "Primeros auxilios"
          : row.original?.classification === "LOST_WORKDAY"
          ? "Incidente, dias perdidos"
          : row.original?.classification === "MEDICAL_TREATMENT"
          ? "Tratamiento medico"
          : row.original?.classification === "NEAR_MISS"
          ? "Near miss"
          : "Desconocido";
      return <div className="">{name}</div>;
    },
  },
];
