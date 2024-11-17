"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

import { PackageColumn, columns } from "./columns";

interface PackageClientProps {
	data: PackageColumn[]
}

export const PackageClient: React.FC<PackageClientProps> = ({
	data
}) => {
	const router = useRouter();
	const params = useParams();

	
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading 
					title={`Packages (${data.length})`}
					description="Manage tour packages for your application"
				/>
				<Button onClick={() => router.push(`/${params.storeId}/packages/new`)} >
					<Plus className="mr-2 h-4 w-4" />
					Add New
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="name" columns={columns} data={data} />
			<Heading title="API" description="API calls for Packages" />
			<Separator />
			<ApiList entityName="packages" entiityIdName="packageId" />
		</>
	)
}