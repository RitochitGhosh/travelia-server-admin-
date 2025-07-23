import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { formatter } from "@/lib/utils";
import { PackageClient } from "./components/client";
import { PackageColumn } from "./components/columns";

const ProductsPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
  const { storeId }= await params;
  const packages = await prismadb.package.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      category: true,
      size: true,
      duration: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedPackages: PackageColumn[] = packages.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    duration: item.duration.days,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PackageClient data={formattedPackages} />
      </div>
    </div>
  );
};

export default ProductsPage;
