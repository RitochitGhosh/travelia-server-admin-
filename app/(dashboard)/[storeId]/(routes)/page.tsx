import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getPackagesCount } from "@/actions/get-packages-count";
import { getSalesCount } from "@/actions/get-sales-count";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { ArrowUpRight, IndianRupeeIcon, Package } from "lucide-react";


interface DashboardPageProps {
  params: Promise<{ storeId: string }>;
}
const DashBoardPage = async ({ params } : DashboardPageProps) => {
  const awaitedParams = await params;
  const totalRevenue = await getTotalRevenue(awaitedParams.storeId);
  const salesCount = await getSalesCount(awaitedParams.storeId);
  const packagesCount = await getPackagesCount(awaitedParams.storeId);
  const graphRevenue = await getGraphRevenue(awaitedParams.storeId);

  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{salesCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products In Stock:</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
              
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {packagesCount}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4 ">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />

          </CardContent>

        </Card>
      </div>
    </div>
  );
};

export default DashBoardPage;
