"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { nanoid } from "nanoid";

import s from "./styles.module.scss";

import { Button, SectionTemplateList } from "@/components";
import { usePageBuilder } from "@/hooks";
import type { FormElementInstance } from "@/components/FormElements";
import { updatePage } from "@/actions";

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

		// // Usa o defaultData diretamente, pois já vem parseado do banco
		const processedContent = template.defaultData || {};

		const element: FormElementInstance = {
			id: nanoid(),
			type: "SectionField",
			extraAttributes: {
				template: cleanTemplate,
				content: processedContent,
			},
		};

		addElement(elements?.length || 0, element);
		toast.success("Seção adicionada com sucesso");
	};

	const handleSaveChanges = async () => {
		console.log("FORM DATA", elements);
		setIsSaving(true);
		try {
			// Converte os elementos para o formato de conteúdo
			const content =
				elements?.map((element) => {
					// Garante que o content seja uma string JSON válida
					const elementContent =
						typeof element.extraAttributes?.content === "string"
							? element.extraAttributes.content
							: JSON.stringify(element.extraAttributes?.content || {});

					return {
						id: element.id,
						templateId: element.extraAttributes?.template.id,
						content: elementContent,
						order: elements?.indexOf(element),
					};
				}) || [];

			// Salva o conteúdo na página
			const result = await updatePage(pageId, {
				content: JSON.stringify(content),
			});

			if (result.success) {
				toast.success("Alterações salvas com sucesso!");
			} else {
				toast.error("Erro ao salvar alterações");
			}
		} catch (error) {
			console.error("Erro ao salvar alterações:", error);
			toast.error("Erro ao salvar alterações");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<aside className={s.designerSidebar}>
			<div className={s.designerSidebarForm}>
				<div className={s.designerSidebarFormHeader}>
					<Button
						type="button"
						width="contain"
						onClick={handleSaveChanges}
						disabled={isSaving}
					>
						{isSaving ? (
							<>
								<Loader2 className={s.loadingIcon} />
								Salvando...
							</>
						) : (
							"Salvar Alterações"
						)}
					</Button>
				</div>
				<p className={s.title}>Templates de Seção</p>
				<div className={s.designerSidebarFormContent}>
					<SectionTemplateList
						slug={slug}
						onSelectTemplate={handleAddSection}
					/>
				</div>
			</div>
		</aside>
	);
};
