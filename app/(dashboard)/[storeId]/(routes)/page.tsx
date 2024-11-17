import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
  params: { storeId: string };
}
const DashBoardPage: React.FC<DashboardPageProps> = async ({ params }) => {

  const storeId =  params.storeId;
  const store = await prismadb.store.findFirst({  
    where: {
      id: storeId,
    },
  });
  return (
    <div className="">
        Active Destination: {store?.name}
    </div>
  )
};

export default DashBoardPage;
