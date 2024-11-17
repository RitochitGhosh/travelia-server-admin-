"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, DurationColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface DurationsClientProps {
	data: DurationColumn[]
}

export const DurationsClient: React.FC<DurationsClientProps> = ({
	data
}) => {
	const router = useRouter();
	const params = useParams();

	
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading 
					title={`Durations (${data.length})`}
					description="Manage durations for your packages"
				/>
				<Button onClick={() => router.push(`/${params.storeId}/durations/new`)} >
					<Plus className="mr-2 h-4 w-4" />
					Add New
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="name" columns={columns} data={data} />
			<Heading title="API" description="API calls for durations" />
			<Separator />
			<ApiList entityName="durations" entiityIdName="durationId" />
		</>
	)
}