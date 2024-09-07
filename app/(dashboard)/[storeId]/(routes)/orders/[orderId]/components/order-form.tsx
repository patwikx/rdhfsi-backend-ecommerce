"use client";

import { Copy, MoreVertical, Trash, Truck } from "lucide-react";
import { Order, OrderItem, Product } from "@prisma/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface OrderFormProps {
  initialData: Order & {
    orderItems: (OrderItem & {
      product: Product & { price: number }; // Ensure price is of type number
    })[];
  };
};

export const OrdersForm: React.FC<OrderFormProps> = ({ initialData }) => {
  // Calculate the total price by summing up all product prices
  const totalPrice = initialData.orderItems.reduce((acc, item) => {
    const itemPrice = item.product.price;

    if (isNaN(itemPrice)) {
      console.error(`Invalid price for product ${item.productId}: ${item.product.price}`);
    }

    return acc + itemPrice;
  }, 0);

  // Format total price with commas
  const formattedTotalPrice = totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'PHP' });

  console.log("Order Items:", initialData.orderItems);
  console.log("Total Price:", formattedTotalPrice);

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="gap-0.5">
          <div className="mb-6">
              <CardTitle>{initialData.companyName}</CardTitle>
              <CardDescription>{initialData.address}</CardDescription>
              <CardDescription>{initialData.contactNumber}</CardDescription>
            </div>
            <CardTitle className="group flex items-center gap-2 text-md">
              Order ID: {initialData.id}
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => navigator.clipboard.writeText(initialData.id)}
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
              </Button>
            </CardTitle>
            <CardTitle className="group flex items-center gap-2 text-md">
               {initialData.poNumber}
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => navigator.clipboard.writeText(initialData.poNumber)}
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy PO #</span>
              </Button>
            </CardTitle>
            <CardDescription>Date: {new Date(initialData.createdAt).toLocaleDateString()}</CardDescription>

          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Truck className="h-3.5 w-3.5" />
              <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">Track Order</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Trash</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Order Details</div>
            <ul className="grid gap-3">
              {initialData.orderItems.map((item) => (
                <li key={item.productId} className="flex items-center justify-between">
                  {/* Display the product name and price */}
                  <span className="text-muted-foreground">
                    {item.product.name}
                  </span>
                  <span>₱ {item.product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </li>
              ))}
            </ul>
            <Separator className="my-2" />
            {/* Show the total price */}
            <ul className="grid gap-3">
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Total</span>
                <span>{formattedTotalPrice}</span>
              </li>
            </ul>
          </div>
          <Separator className="my-4" />
          <div>
          <ul className="grid gap-3">
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Delivery Address / Contact Person Information</span>
              </li>
              <li>
                {initialData.address}
              </li>
              <li>
                {initialData.contactNumber}
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated <time dateTime={initialData.updatedAt.toISOString()}>{new Date(initialData.updatedAt).toLocaleDateString()}</time>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default OrdersForm;
