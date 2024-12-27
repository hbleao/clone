"use client";

import React, { useState } from "react";
import { Blocks } from "lucide-react";
import { toast } from "sonner";

import { SectionDialog } from "@/components/SectionDialog";
import type { FormElementInstance } from "@/components/FormElements";

import s from "./styles.module.scss";

interface FormComponentProps {
	elementInstance: FormElementInstance;
}

export function FormComponent({ elementInstance }: FormComponentProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	const template = elementInstance.extraAttributes?.template;
	const content = elementInstance.extraAttributes?.content;

	// Parse o conteúdo de string para objeto
	const data = content ? JSON.parse(content) : {};

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
