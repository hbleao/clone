"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { nanoid } from "nanoid";

import s from "./styles.module.scss";

import { Button, SectionTemplateList } from "@/components";
import { usePageBuilder } from "@/hooks";

import type { SectionTemplate } from "@/types/section";
import { ChevronLeft } from "lucide-react";

export const PageBuilderSidebar = () => {
	const params = useParams();
	const router = useRouter();
	const slug = params.slug as string;
	const { elements, addElement } = usePageBuilder();

	const handleAddSection = (template: SectionTemplate) => {
		// Cria uma cópia limpa do template
		const cleanTemplate = {
			id: template.id,
			name: template.name,
			type: template.type,
			schema: template.schema,
		};

		const element = {
			id: nanoid(),
			type: "section",
			template: cleanTemplate,
			content: template.defaultData || {},
		};

		console.log("TEMPLATE SELECIONADO", elements);

		addElement(elements?.length || 0, element);
		toast.success("Seção adicionada com sucesso");
	};

	return (
		<div className={s.pageBuilderSidebar}>
			<div className={s.header}>
				<Button
					type="button"
					variant="disabled"
					width="contain"
					onClick={() => router.back()}
				>
					<ChevronLeft />
					Voltar
				</Button>
			</div>

			<div className={s.content}>
				<h2>Seções</h2>

				<SectionTemplateList slug={slug} onSelectTemplate={handleAddSection} />
			</div>
		</div>
	);
};
