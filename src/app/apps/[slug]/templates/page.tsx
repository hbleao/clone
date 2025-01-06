"use client";
import { useParams } from "next/navigation";

import { DashboardLayout } from "@/components";

export default function TemplatesPage() {
	const params = useParams();

	return (
		<DashboardLayout slug={params.slug}>
			<div>
				<h1>Templates</h1>
			</div>
		</DashboardLayout>
	);
}
