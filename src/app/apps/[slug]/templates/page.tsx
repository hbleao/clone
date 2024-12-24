"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import type { SectionTemplate } from "@/types/section";
import {
	deleteSectionTemplate,
	getSectionTemplates,
} from "@/actions/sectionTemplate";
import { Header, Link } from "@/components";

import s from "./styles.module.scss";
import { PlusIcon } from "lucide-react";

export default function TemplatesPage() {
	const params = useParams();
	const [templates, setTemplates] = useState<SectionTemplate[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadTemplates();
	}, [params.slug]);

	async function loadTemplates() {
		try {
			const result = await getSectionTemplates(params.slug as string);
			if (result.success) {
				setTemplates(result.data);
			} else {
				toast.error("Erro ao carregar templates");
			}
		} catch (error) {
			console.error("Erro ao carregar templates:", error);
			toast.error("Erro ao carregar templates");
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete(templateId: string) {
		if (!confirm("Tem certeza que deseja excluir este template?")) return;

		try {
			const result = await deleteSectionTemplate(
				params.slug as string,
				templateId,
			);
			if (result.success) {
				toast.success("Template excluído com sucesso");
				loadTemplates();
			} else {
				toast.error("Erro ao excluir template");
			}
		} catch (error) {
			console.error("Erro ao excluir template:", error);
			toast.error("Erro ao excluir template");
		}
	}

	if (loading) {
		return <div>Carregando...</div>;
	}

	return (
		<>
			<Header />
			<div className={s.container}>
				<header className={s.header}>
					<h1>Templates de Seção</h1>
					<Link href={`/apps/${params.slug}/templates/novo`} width="contain">
						<PlusIcon />
						Novo Template
					</Link>
				</header>

				<div className={s.grid}>
					{templates.map((template) => (
						<div key={template.id} className={s.card}>
							{template.thumbnail && (
								<img src={template.thumbnail} alt={template.name} />
							)}
							<div className={s.content}>
								<h3>{template.name}</h3>
								<p>{template.description}</p>
								<div className={s.type}>{template.type}</div>
							</div>
							<div className={s.actions}>
								<Link
									href={`/apps/${params.slug}/templates/${template.id}/editar`}
								>
									Editar
								</Link>
								<button onClick={() => handleDelete(template.id)}>
									Excluir
								</button>
							</div>
						</div>
					))}

					{templates.length === 0 && (
						<div className={s.empty}>
							<p>Nenhum template encontrado</p>
							<p>Crie seu primeiro template de seção!</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
