import prismadb from "@/lib/prismadb";
import { PackageForm } from "./components/package-form";

const PackagePage = async ({
  params,
}: {
  params: { packageId: string; storeId: string };
}) => {
  const packagee = await prismadb.package.findUnique({
    // package is a reserved word in React.Strictmode
    where: {
      id: params.packageId,
    },
    include: {
      images: true,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const durations = await prismadb.duration.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PackageForm
          categories={categories}
          sizes={sizes}
          durations={durations}
          initialData={packagee}
        />
      </div>
    </div>
  );
};

export default PackagePage;
