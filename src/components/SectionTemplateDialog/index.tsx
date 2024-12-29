"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import s from "./styles.module.scss";

import { Button, Dialog, SectionTemplateRenderField } from "@/components";

import type { SectionTemplateDialogProps } from "./types";

export function SectionTemplateDialog({
	onOpenChange,
	template,
	defaultValues,
	onSave,
}: SectionTemplateDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState(defaultValues || {});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			// Valida os campos obrigatórios
			const missingFields = template.schema.fields
				?.filter((field) => field.required && !formData[field.name])
				.map((field) => field.label);

			if (missingFields?.length) {
				throw new Error(
					`Campos obrigatórios não preenchidos: ${missingFields.join(", ")}`,
				);
			}

			// Passa o objeto diretamente
			onSave(formData);
			onOpenChange(false);
			toast.success("Seção atualizada com sucesso!");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Erro ao atualizar seção");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog title="Editar seção" handleCloseModal={() => onOpenChange(false)}>
			<p className={s.subtitle}>
				{template.name} - {template.type}
			</p>

			<form onSubmit={handleSubmit} className={s.form}>
				{template.schema.fields?.map((field) => (
					<div key={field.name} className={s.field}>
						<label htmlFor={field.name}>
							{field.label}
							{field.required && <span className={s.required}>*</span>}
						</label>
						<SectionTemplateRenderField
							field={field}
							formData={formData}
							setFormData={setFormData}
						/>
					</div>
				))}

				<div className={s.actions}>
					<Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Salvar
					</Button>
				</div>
			</form>
		</Dialog>
	);
}
