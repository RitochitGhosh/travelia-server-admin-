import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { formatter } from "@/lib/utils";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";

const OrdersPage = async ({
	params
}: {
	params: Promise<{ storeId: string }>
}) => {
  const { storeId } = await params;
  const orders = await prismadb.order.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      orderItems: {
        include: {
          package: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem: typeof item.orderItems[number]) => orderItem.package?.name || '')
      .join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total: number, orderItem: typeof item.orderItems[number]) => {
        return total + Number(orderItem.package?.price || 0);
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
