import prismadb from "@/lib/prismadb";
import { OrdersForm } from "./components/order-form";
import { CardTitle } from "@/components/ui/card";

const OrderDetailsPage = async ({
  params
}: {
  params: { orderId: string, storeId: string }
}) => {
  const orders = await prismadb.order.findUnique({
    where: {
      id: params.orderId,
    },
    include: {
      orderItems: {
        include: {
          product: true, // Include product details in each order item
        },
      },
    },
  });

  // If no order found, handle it gracefully
  if (!orders) {
    return <div>Order not found</div>;
  }

  // Convert Decimal fields to numbers
  const ordersWithFormattedPrice = {
    ...orders,
    orderItems: orders.orderItems.map(item => ({
      ...item,
      product: {
        ...item.product,
        price: parseFloat(item.product.price.toString()), // Convert Decimal to number
      },
    })),
  };

  return ( 
    <div className="flex-col">
      <CardTitle className="mt-6 ml-8 font-bold text-xl">Delivery Receipt</CardTitle>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrdersForm initialData={ordersWithFormattedPrice} />
      </div>
    </div>
  );
}

export default OrderDetailsPage;