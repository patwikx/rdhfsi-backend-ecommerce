"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";

export type OrderColumn = {
  id: string;
  address: string;
  isPaid: boolean;
  totalItemAmount: string;
  products: string;
  createdAt: string;
  contactNumber: string;
  companyName: string;
  poNumber: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "companyName",
    header: "Company",
  },
  {
    accessorKey: "poNumber",
    header: "PO #",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact #",
  },
  {
    accessorKey: "totalItemAmount",
    header: "Total Amount",
  },
  {
    accessorKey: "isPaid",
    header: "Served",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
