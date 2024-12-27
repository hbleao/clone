"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { nanoid } from "nanoid";

import type { Page } from "@/types/page";
import type { SectionTemplate } from "@/types/section";
import { Header } from "@/components";
import { Section } from "@/components/Section";
import { EditorSidebar } from "@/components/EditorSidebar";
import {
	getPageService,
	updatePageService,
	getAllSectionTemplateService,
} from "@/services";

import s from "./styles.module.scss";

export default function PageEditor() {
	const params = useParams();
	const [page, setPage] = useState<Page | null>(null);
	const [templates, setTemplates] = useState<SectionTemplate[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadPage();
		loadTemplates();
	}, [params.slug, params.pageId]);

	async function loadPage() {
		try {
			const result = await getPageService(
				params.slug as string,
				params.pageId as string,
			);
			if (result.success && result.data) {
				setPage(result.data);
			} else {
				toast.error(result.error?.message || "Erro ao carregar página");
			}
		} catch (error) {
			console.error("Erro ao carregar página:", error);
			toast.error("Erro ao carregar página");
		} finally {
			setLoading(false);
		}
	}

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
		}
	}

	async function handleAddTemplate(template: SectionTemplate) {
		if (!page) return;

		const newSection = {
			id: nanoid(),
			templateId: template.id,
			template,
			data: {},
			order: page.sections.length,
		};

		const updatedPage = {
			...page,
			sections: [...page.sections, newSection],
		};

		setPage(updatedPage);

		const result = await updatePageService(
			params.slug as string,
			params.pageId as string,
			updatedPage,
		);

		if (!result.success) {
			toast.error(result.error?.message || "Erro ao adicionar seção");
			setPage(page);
		}
	}

	async function handleRemoveSection(sectionId: string) {
		if (!page) return;

		const updatedSections = page.sections.filter(
			(section) => section.id !== sectionId,
		);

		const updatedPage = {
			...page,
			sections: updatedSections,
		};

		setPage(updatedPage);

		const result = await updatePageService(
			params.slug as string,
			params.pageId as string,
			updatedPage,
		);

		if (!result.success) {
			toast.error(result.error?.message || "Erro ao remover seção");
			setPage(page);
		}
	}

	if (loading) {
		return <div className={s.loading}>Carregando...</div>;
	}

	if (!page) {
		return <div className={s.error}>Página não encontrada</div>;
	}

	return (
		<div className={s.container}>
			<Header />

			<div className={s.editor}>
				<EditorSidebar
					templates={templates}
					onSelectTemplate={handleAddTemplate}
				/>

				<div className={s.content}>
					<div className={s.sections}>
						{page.sections.map((section) => (
							<Section
								key={section.id}
								section={section}
								onRemove={handleRemoveSection}
							/>
						))}

						{page.sections.length === 0 && (
							<div className={s.empty}>
								<p>Nenhuma seção adicionada</p>
								<p>Arraste elementos da barra lateral para começar</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
