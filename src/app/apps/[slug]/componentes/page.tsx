"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

import { Link, DashboardLayout } from "@/components";
import { getAllSectionTemplateService } from "@/services";

import s from "./styles.module.scss";

type TemplatesByCategory = {
	[key: string]: SectionTemplateField[];
};

export default function ComponentsPage() {
	const params = useParams();
	const [templates, setTemplates] = useState<SectionTemplateField[]>([]);
	const [loading, setLoading] = useState(true);

	async function loadTemplates() {
		try {
			const result = await getAllSectionTemplateService(params.slug as string);
			if (result.success && result.data) {
				setTemplates(result.data);
			} else {
				toast.error(result.error?.message || "Erro ao carregar templates");
			}
		} catch (error) {
			console.error("Erro ao carregar templates:", error);
			toast.error("Erro ao carregar templates");
		} finally {
			setLoading(false);
		}
	}

	const templatesByCategory = templates.reduce<TemplatesByCategory>(
		(acc, template) => {
			const category = template.type || "Outros";
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(template);
			return acc;
		},
		{},
	);

	useEffect(() => {
		loadTemplates();
	}, [params.slug]);

	if (loading) {
		return <div className={s.loading}>Carregando templates...</div>;
	}

	return (
		<DashboardLayout slug={params.slug}>
			<div className={s.container}>
				<div className={s.pageHeader}>
					<h1>Lista de Componentes</h1>
					<Link
						href={`/apps/${params.slug}/componentes/novo`}
						width="contain"
						size="lg"
					>
						<PlusIcon size={20} />
						Novo Componente
					</Link>
				</div>

				{templates.length === 0 ? (
					<div className={s.empty}>
						<p>Nenhum componente cadastrado</p>
					</div>
				) : (
					<div className={s.categories}>
						{Object.entries(templatesByCategory).map(
							([category, categoryTemplates]) => (
								<div key={category} className={s.category}>
									<h2 className={s.categoryTitle}>{category}</h2>
									<div className={s.grid}>
										{categoryTemplates.map((template) => (
											<div key={template.id} className={s.templateCard}>
												<div className={s.templateInfo}>
													<h3>{template.name}</h3>
													<p>{template.description}</p>
												</div>
												<div className={s.templateMeta}>
													<span>
														Criado em:{" "}
														{template.createdAt.toLocaleDateString("pt-BR", {
															day: "2-digit",
															month: "long",
															year: "numeric",
														})}
													</span>
													<span>
														Última atualização:{" "}
														{template.updatedAt.toLocaleDateString("pt-BR", {
															day: "2-digit",
															month: "long",
															year: "numeric",
														})}
													</span>
												</div>
												<div className={s.actions}>
													<Link
														href={`/apps/${params.slug}/templates/${template.id}/editar`}
														className={s.editButton}
													>
														Editar
													</Link>
													<button className={s.deleteButton}>Excluir</button>
												</div>
											</div>
										))}
									</div>
								</div>
							),
						)}
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}
