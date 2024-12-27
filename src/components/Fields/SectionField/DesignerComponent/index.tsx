"use client";

import React, { useState } from "react";
import { Blocks, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useDesigner } from "@/hooks";
import { SectionDialog } from "@/components/SectionDialog";
import { Button } from "@/components";
import type { FormElementInstance } from "@/components/FormElements";

import s from "./styles.module.scss";

interface DesignerComponentProps {
	elementInstance: FormElementInstance;
}

export function DesignerComponent({ elementInstance }: DesignerComponentProps) {
	const { removeElement } = useDesigner();
	const [dialogOpen, setDialogOpen] = useState(false);

	const template = elementInstance.extraAttributes?.template;
	const content = elementInstance.extraAttributes?.content;

	// Parse o conteúdo de string para objeto
	const data = content ? JSON.parse(content) : {};

	const handleRemove = () => {
		removeElement(elementInstance.id);
		toast.success("Seção removida com sucesso!");
	};

	const handleSave = (newData: { content: string }) => {
		if (elementInstance.extraAttributes) {
			elementInstance.extraAttributes.content = newData.content;
			toast.success("Seção atualizada com sucesso!");
		}
	};

	if (!template) return null;

	return (
		<>
			<div className={s.section}>
				<div className={s.header}>
					<button
						type="button"
						className={s.breadcrumb}
						onClick={() => setDialogOpen(true)}
					>
						<Blocks className={s.icon} />
						<span>
							{template.name} - {template.type}
						</span>
					</button>

					<Button variant="ghost" size="icon" onClick={handleRemove}>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>

				<div className={s.preview}>
					<pre>{JSON.stringify(data, null, 2)}</pre>
				</div>
			</div>

			{dialogOpen && (
				<SectionDialog
					open={dialogOpen}
					onOpenChange={setDialogOpen}
					template={template}
					defaultValues={data}
					onSave={handleSave}
				/>
			)}
		</>
	);
}
