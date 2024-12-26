"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

import type { SectionTemplate } from "@/types/section";
import { Header, Link } from "@/components";
import { getAllSectionTemplateService } from "@/services";

import s from "./styles.module.scss";

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

			<div className={s.grid}>
				{templates.map((template) => (
					<div key={template.id} className={s.templateCard}>
						<div className={s.templateInfo}>
							<h2>{template.name}</h2>
							<p>{template.description}</p>
							<div className={s.type}>{template.type}</div>
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

				{templates.length === 0 && (
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
				)}
			</div>
		</div>
	);
}
