import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { DurationsClient } from "./components/client";
import { DurationColumn } from "./components/columns";

const DurationsPage = async ({ params }: { params: { storeId: string } }) => {
  const durations = await prismadb.duration.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });


  const formattedDurations: DurationColumn[] = durations.map((item) => ({
    id: item.id,
    name: item.name,
    days: item.days,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DurationsClient data={formattedDurations} />
      </div>
    </div>
  );
};

export default DurationsPage;
