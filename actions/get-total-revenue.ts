import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId: storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          package: true,
        },
      },
    },
  });
  const totalRevenue = paidOrders?.reduce((total: number, order) => {
    const orderTotal = order.orderItems.reduce((orderSum: number, item) => {
      return orderSum + item.package.price.toNumber();
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
