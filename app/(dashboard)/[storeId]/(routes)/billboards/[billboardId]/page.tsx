import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

// No need to explicitly define `BillboardPageProps` because Next.js will handle that
const BillboardPage = async ({ params }: { params: { billboardId: string } }) => {
  // Fetch the billboard data from the database
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId, // Using the billboardId from params
    },
  });

  // Check if the billboard exists
  if (!billboard) {
    return <div>Billboard not found</div>;
  }

  // Render the BillboardForm component with the initial data
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
