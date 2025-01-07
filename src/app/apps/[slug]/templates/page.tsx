"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Columns, Plus, PlusIcon } from "lucide-react";

import { DashboardLayout, Button, Link, Table } from "@/components";
import { api } from "@/lib/api";

import styles from "./styles.module.scss";

import type { Template } from "./types";

export default function TemplatesPage() {
	const params = useParams();
	const router = useRouter();

	const [templates, setTemplates] = useState<Template[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const handleEdit = (template: Template) => {
		// Previne a propagação do evento para não conflitar com o onRowClick
		event?.stopPropagation();
		// Navega para a página de edição do template
		router.push(`/apps/${params.slug}/templates/${template.id}/editar`);
	};

	const columns = [
		{ key: "name", title: "Nome" },
		{ key: "description", title: "Descrição" },
		{ key: "pages", title: "Páginas" },
		{ key: "components", title: "Componentes" },
		{ key: "created_at", title: "Criado em" },
		{
			key: "actions",
			title: "Ações",
			render: (item: Template) => (
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => handleEdit(item)}
				>
					Editar
				</Button>
			),
		},
	];

	useEffect(() => {
		async function loadTemplates() {
			try {
				const response = await api.get(`/apps/${params.slug}/templates`);
				if (response?.data?.templates) {
					setTemplates(response.data.templates);
				}
			} catch (error) {
				console.error("Erro ao carregar templates:", error);
			} finally {
				setIsLoading(false);
			}
		}

		loadTemplates();
	}, [params.slug]);

	return (
		<DashboardLayout slug={params.slug}>
			<div className={styles.container}>
				<div className={styles.pageHeader}>
					<h1>Gerencie a lista de templates de página do seu aplicativo</h1>
					<Link
						href={`/apps/${params.slug}/templates/novo`}
						width="contain"
						size="lg"
					>
						<PlusIcon size={20} />
						Novo template
					</Link>
				</div>
				<Table
					data={templates}
					columns={columns}
					isLoading={isLoading}
					emptyMessage="Nenhum template encontrado"
					itemsPerPage={10}
					onRowClick={(item) =>
						router.push(`/apps/${params.slug}/templates/${item.id}`)
					}
				/>
			</div>
		</DashboardLayout>
	);
}
