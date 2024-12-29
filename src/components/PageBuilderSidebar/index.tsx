"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { nanoid } from "nanoid";

import s from "./styles.module.scss";

import { Button, SectionTemplateList } from "@/components";
import { usePageBuilder } from "@/hooks";
import { updatePage } from "@/actions";
import type { PageBuilderElement } from "@/types/pageBuilder";
import type { SectionTemplate } from "@/types/section";

export const PageBuilderSidebar = () => {
	const params = useParams();
	const slug = params.slug as string;
	const pageId = params.pageId as string;
	const { elements, addElement } = usePageBuilder();
	const [isSaving, setIsSaving] = useState(false);

	const handleAddSection = (template: SectionTemplate) => {
		// Cria uma cópia limpa do template
		const cleanTemplate = {
			id: template.id,
			name: template.name,
			type: template.type,
			schema: template.schema,
		};

		const element: PageBuilderElement = {
			id: nanoid(),
			type: "section",
			template: cleanTemplate,
			content: template.defaultData || {},
		};

		addElement(elements?.length || 0, element);
		toast.success("Seção adicionada com sucesso");
	};

	const handleSaveChanges = async () => {
		setIsSaving(true);
		try {
			console.log("Elementos a serem salvos:", elements);

			// Salva os elementos diretamente
			const result = await updatePage(pageId, { content: elements });

			if (!result.success) {
				throw new Error(result.error);
			}

			toast.success("Página salva com sucesso!");
		} catch (error) {
			console.error("Error saving page:", error);
			toast.error("Erro ao salvar página");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className={s.pageBuilderSidebar}>
			<div className={s.header}>
				<h2>Seções</h2>
				<Button type="button" onClick={handleSaveChanges} disabled={isSaving}>
					{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Salvar Alterações
				</Button>
			</div>

			<div className={s.content}>
				<SectionTemplateList slug={slug} onSelectTemplate={handleAddSection} />
			</div>
		</div>
	);
};
