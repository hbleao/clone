"use client";
import { useState } from "react";
import { toast } from "sonner";

import s from "./styles.module.scss";

import { Button, Dialog } from "@/components";
import { SectionTemplateRenderField } from "../SectionTemplateRenderField";

interface SectionTemplateDialogProps {
	onOpenChange: (open: boolean) => void;
	handleSave: (formatData: any) => void;
	template: any;
}

export function SectionTemplateDialog({
	onOpenChange,
	template,
	handleSave,
	content,
}: SectionTemplateDialogProps) {
	const [formData, setFormData] = useState<any>(content);

	const onHandleSave = async () => {
		try {
			await handleSave(formData);

			toast.success("Template salvo com sucesso!");
			onOpenChange(false);
		} catch (error) {
			console.error("Erro ao salvar template:", error);
			toast.error("Erro ao salvar template");
		}
	};

	return (
		<Dialog title="Editar seção" handleCloseModal={() => onOpenChange(false)}>
			<p className={s.subtitle}>
				{template.name} - {template.type}
			</p>

			<div className={s.fields}>
				{template.schema.fields?.map((field: any) => (
					<SectionTemplateRenderField
						key={field.name}
						field={field}
						formData={formData}
						setFormData={setFormData}
						schema={template.schema}
					/>
				))}
			</div>

			<div className={s.footer}>
				<Button
					type="button"
					width="contain"
					size="lg"
					variant="disabled"
					onClick={() => onOpenChange(false)}
				>
					Cancelar
				</Button>
				<Button type="button" width="contain" size="lg" onClick={onHandleSave}>
					Salvar edição
				</Button>
			</div>
		</Dialog>
	);
}
