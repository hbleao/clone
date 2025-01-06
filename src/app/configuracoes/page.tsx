import { DashboardLayout } from "@/components";

export default async function Configuracoes({ params }) {
	return (
		<DashboardLayout slug={params.slug}>
			<div>
				<h1>Minhas configurações</h1>
			</div>
		</DashboardLayout>
	);
}
