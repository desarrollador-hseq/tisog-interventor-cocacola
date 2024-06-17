"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DefaultTool, Tool, TypeTool } from "@prisma/client";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const toolsTableColumns: ColumnDef<
  DefaultTool & { typeTool: TypeTool | null }
>[] = [
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
          Nombre
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
    accessorKey: "typeTool",
    accessorFn: (value) => value.typeTool?.name,
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
      const name = row.original?.typeTool?.name;
      return <div className="">{name}</div>;
    },
  },
];
