"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PackageColumn = {
  id: string;
  name: string;
  price: string,
  size: string,
  category: string,
  duration: string,
  isFeatured: boolean,
  isArchived: boolean,
  createdAt: string;
};

export const columns: ColumnDef<PackageColumn>[] = [
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "isArchived",
    header: "Archived"
  },
  {
    accessorKey: "isFeatured",
    header: "Featured"
  },
  {
    accessorKey: "price",
    header: "Price"
  },
  {
    accessorKey: "category",
    header: "Category"
  },
  {
    accessorKey: "size",
    header: "Size"
  },
  {
    accessorKey: "duration",
    header: "Duration"
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },{
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
