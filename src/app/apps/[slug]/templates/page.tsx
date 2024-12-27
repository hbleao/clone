"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

import type { SectionTemplate } from "@/types/section";
import { Header, Link } from "@/components";
import { getAllSectionTemplateService } from "@/services";

import s from "./styles.module.scss";

type TemplatesByCategory = {
	[key: string]: SectionTemplate[];
};

export default function TemplatesPage() {
	const params = useParams();
	const [templates, setTemplates] = useState<SectionTemplate[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadTemplates();
	}, [params.slug]);

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

	const templatesByCategory = templates.reduce<TemplatesByCategory>((acc, template) => {
		const category = template.type || "Outros";
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(template);
		return acc;
	}, {});

	if (loading) {
		return <div className={s.loading}>Carregando templates...</div>;
	}

	return (
		<div className={s.container}>
			<Header />
			
			<div className={s.pageHeader}>
				<h1>Templates de Seção</h1>
				<Link href={`/apps/${params.slug}/templates/novo`} className={s.newButton}>
					<PlusIcon size={20} />
					Novo Template
				</Link>
			</div>

			{templates.length === 0 ? (
				<div className={s.empty}>
					<p>Nenhum template encontrado</p>
					<Link
						href={`/apps/${params.slug}/templates/novo`}
						className={s.newButton}
					>
						<PlusIcon size={20} />
						Criar meu primeiro template
					</Link>
				</div>
			) : (
				<div className={s.categories}>
					{Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
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
											<button className={s.deleteButton}>
												Excluir
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
