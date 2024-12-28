"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import s from "./styles.module.scss";

import { Button, Dialog, PageBuilderRenderField } from "@/components";

import type { SectionDialogProps } from "./types";

export function SectionDialog({
	onOpenChange,
	template,
	defaultValues,
	onSave,
}: SectionDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState(defaultValues);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Passa o objeto diretamente
			onSave(formData);
			onOpenChange(false);
			toast.success("Seção atualizada com sucesso!");
		} catch (error) {
			toast.error("Erro ao atualizar seção");
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
				{template.schema.fields?.map((field: Field) => (
					<div key={field.name} className={s.field}>
						<label htmlFor={field.name}>
							{field.label}
							{field.required && <span className={s.required}>*</span>}
						</label>
						<PageBuilderRenderField
							field={field}
							formData={formData}
							setFormData={setFormData}
						/>
					</div>
				))}

				<div className={s.footer}>
					<Button
						type="button"
						variant="insurance"
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading && <Loader2 />}
						Salvar
					</Button>
				</div>
			</form>
		</Dialog>
	);
}
