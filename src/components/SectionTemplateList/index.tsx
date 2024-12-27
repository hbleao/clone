"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { getAllSectionTemplateService } from "@/services";
import type { SectionTemplate } from "@/types";
import type { ElementsType } from "@/components/FormElements";

import s from "./styles.module.scss";

interface DraggableTemplateItemProps {
	template: SectionTemplate;
}

interface SectionTemplateListProps {
	slug: string;
	onSelectTemplate?: (template: SectionTemplate) => void;
}

function DraggableTemplateItem({ template }: DraggableTemplateItemProps) {
	const type: ElementsType = "SectionField";
	const draggable = useDraggable({
		id: `draggable-template-${template.id}`,
		data: {
			type,
			template,
			isDesignerBtnElement: true,
		},
	});

	if (!draggable.isDragging) {
		return (
			<div
				ref={draggable.setNodeRef}
				{...draggable.listeners}
				{...draggable.attributes}
				className={s.template}
				style={{
					transform: CSS.Translate.toString(draggable.transform),
				}}
			>
				<div className={s.info}>
					<h3>{template.name}</h3>
					<span>{template.type}</span>
				</div>
			</div>
		);
	}

	return (
		<div
			ref={draggable.setNodeRef}
			{...draggable.listeners}
			{...draggable.attributes}
			className={`${s.template} ${s.isDragging}`}
		>
			<div className={s.info}>
				<h3>{template.name}</h3>
				<span>{template.type}</span>
			</div>
		</div>
	);
}

export function SectionTemplateList({
	slug,
	onSelectTemplate,
}: SectionTemplateListProps) {
	const [templates, setTemplates] = useState<SectionTemplate[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadTemplates() {
			try {
				const { data } = await getAllSectionTemplateService(slug);
				setTemplates(data || []);
			} catch (error) {
				toast.error("Erro ao carregar templates");
			} finally {
				setIsLoading(false);
			}
		}

		loadTemplates();
	}, [slug]);

	if (isLoading) {
		return (
			<div className={s.loading}>
				<p>Carregando templates...</p>
			</div>
		);
	}

	if (!templates.length) {
		return (
			<div className={s.empty}>
				<p>Nenhum template encontrado</p>
			</div>
		);
	}

	return (
		<div className={s.container}>
			{templates.map((template) => (
				<DraggableTemplateItem key={template.id} template={template} />
			))}
		</div>
	);
}
