"use client";
import { useState, useMemo } from "react";
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
	const parsedSchema = useMemo(() => {
		try {
			return typeof template.schema === 'string' ? JSON.parse(template.schema) : template.schema;
		} catch (error) {
			console.error('Erro ao fazer parse do schema:', error);
			return { fields: [] };
		}
	}, [template.schema]);

	const parsedDefaultValues = useMemo(() => {
		try {
			if (!template.defaultData) return {};
			return typeof template.defaultData === 'string' 
				? JSON.parse(template.defaultData) 
				: template.defaultData;
		} catch (error) {
			console.error('Erro ao fazer parse dos valores padrão:', error);
			return {};
		}
	}, [template.defaultData]);

	const initializeNestedFields = (fields: any[], parentPath = "") => {
		let initialValues: Record<string, any> = {};

		fields.forEach((field) => {
			const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;
			const defaultValue = defaultValues[field.name] || parsedDefaultValues[field.name];

			if (field.type === "array") {
				initialValues[field.name] = defaultValue || [];
			} else if (field.type === "object" && field.fields) {
				if (defaultValue) {
					initialValues[field.name] = defaultValue;
				} else {
					initialValues[field.name] = initializeNestedFields(field.fields, field.name);
				}
			} else {
				initialValues[field.name] = defaultValue || "";
			}
		});

		return initialValues;
	};

	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState(() => {
		return initializeNestedFields(parsedSchema.fields || []);
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			// Valida os campos obrigatórios
			const validateField = (field: any, value: any): boolean => {
				if (field.required) {
					if (field.type === "array") {
						return Array.isArray(value) && value.length > 0;
					} else if (field.type === "object" && field.fields) {
						return field.fields.every((subField: any) =>
							validateField(subField, value?.[subField.name])
						);
					} else {
						return value !== undefined && value !== null && value !== "";
					}
				}
				return true;
			};

			const missingFields = parsedSchema.fields
				?.filter((field) => !validateField(field, formData[field.name]))
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
				{parsedSchema.fields?.map((field) => (
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
					<Button
						type="button"
						variant="ghost"
						onClick={() => onOpenChange(false)}
					>
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
