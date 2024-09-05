import prismadb from "@/lib/prismadb";

export const getPendingOrders = async (storeId: string) => {
  const pendingOrders = await prismadb.order.count({
    where: {
      storeId,
      isPaid: false,
    }
  });

  return pendingOrders;
};
