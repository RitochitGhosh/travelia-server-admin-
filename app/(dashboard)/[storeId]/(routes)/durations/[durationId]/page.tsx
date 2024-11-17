import prismadb from "@/lib/prismadb";
import { DurationForm } from "./components/duration-form";

const DurationPage = async ({
  params,
}: {
  params: { durationId: string };
}) => {
  const duration = await prismadb.duration.findUnique({
    where: {
      id: params.durationId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DurationForm initialData={duration} />
      </div>
    </div>
  );
};

export default DurationPage;
