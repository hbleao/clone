"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import s from "./styles.module.scss";

import { Button, SectionTemplateDialog } from "@/components";
import { usePageBuilder } from "@/hooks";
import type { PageBuilderElementProps } from "@/types/pageBuilder";

export function SectionElement({
	element,
	onRemove,
}: PageBuilderElementProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const { template, content } = element;
	const { updateElement } = usePageBuilder();

	if (!template) return null;

	const handleSave = (newData: Record<string, any>) => {
		const updatedElement = {
			...element,
			content: newData,
		};

		updateElement(element.id, updatedElement);
		setDialogOpen(false);
		toast.success("Seção atualizada com sucesso!");
	};

	return (
		<>
			<div className={s.section}>
				<div className={s.header}>
					<div className={s.info}>
						<h3>{template.name}</h3>
						<span>{template.type}</span>
					</div>
					<div className={s.actions}>
						<Button type="button" variant="ghost" onClick={() => setDialogOpen(true)}>
							<Pencil className="h-4 w-4" />
						</Button>
						<Button type="button" variant="ghost" onClick={onRemove}>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</div>

				<div className={s.preview}>
					{Object.entries(content || {}).map(([key, value]) => (
						<div key={key} className={s.field}>
							<strong>{key}:</strong> {String(value)}
						</div>
					))}
				</div>
			</div>

			{dialogOpen && (
				<SectionTemplateDialog
					onOpenChange={setDialogOpen}
					template={template}
					defaultValues={content || {}}
					onSave={handleSave}
				/>
			)}
		</>
	);
}
