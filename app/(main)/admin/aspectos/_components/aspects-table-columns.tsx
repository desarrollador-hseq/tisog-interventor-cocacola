"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SecurityCategory, SecurityQuestion } from "@prisma/client";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const aspectsTableColumns: ColumnDef<
  SecurityQuestion & { category: SecurityCategory | null }
>[] = [
  {
    accessorKey: "question",
    accessorFn: (value) => value.question,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Pregunta
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original?.question;
      return <div className="truncate text-xs">{name}</div>;
    },
  },
  {
    accessorKey: "negativeQuestion",
    accessorFn: (value) => value.negativeQuestion,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Negativo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original?.negativeQuestion;
      return <div className="text-xs truncate">{name}</div>;
    },
  },
  {
    accessorKey: "category",
    accessorFn: (value) => value.category?.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-secondary/30 hover:text-secondary-foreground text-xs"
        >
          Categoria
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original?.category?.name;
      return <div className="">{name}</div>;
    },
  },
];
