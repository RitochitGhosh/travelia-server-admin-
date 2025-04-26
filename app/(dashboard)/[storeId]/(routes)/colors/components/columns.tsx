"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ColorColumn = {
  id: string;
  name: string;
  value: string; // Using the original "days" field to store color value
  createdAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "value",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <div 
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.value }}
        />
        <div>{row.original.value}</div>
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
];