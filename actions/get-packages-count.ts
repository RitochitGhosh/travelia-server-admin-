import prismadb from "@/lib/prismadb";

export const getPackagesCount = async (storeId: string) => {
  const packagesCount = await prismadb.package.count({
    where: {
      storeId: storeId,
      isArchived: false,
    },
  });

  return packagesCount;
 
};
