"use client"

import { ColumnDef } from "@tanstack/react-table"

export type OrderColumn = {
  id: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
  companyName: string;
  poNumber: string;
  contactNumber: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "barcode",
    header: "Barcode",
  },
  {
    accessorKey: "products",
    header: "Products",
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
    accessorKey: "contactNumber",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    accessorKey: "isPaid",
    header: "Served",
  },
];
