"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";

const roleOptions = [
  { value: "ADMIN", label: "Administrador" },
  { value: "USER", label: "Interventor/Analista" },
  { value: "VIEWER", label: "Observador" },
];

export const userTableColumns: ColumnDef<User>[] = [
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
          Nombres
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
    accessorKey: "numDoc",
    accessorFn: (value) => value.numDoc,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          N° Documento
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
    accessorKey: "role",
    accessorFn: (value) => value.numDoc,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Rol
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role = row.original?.role;
      const sourceEsp = roleOptions.find((d) => d.value === role);
      return <div className="">{sourceEsp?.label}</div>;
    },
  },
  {
    accessorKey: "email",
    accessorFn: (value) => value.numDoc,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Correo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const numDoc = row.original?.email;
      return <div className="">{numDoc}</div>;
    },
  },
  {
    accessorKey: "isMaster",
    accessorFn: (value) => value.isMaster,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Editar parametros
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const check = row.original?.isMaster;
      return <div className="">{check ? "Si" : "No"}</div>;
    },
  },
];
