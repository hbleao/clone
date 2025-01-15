"use client";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import s from "./styles.module.scss";

import { Button, Dialog } from "@/components";
import { SectionTemplateRenderField } from "../SectionTemplateRenderField";

interface SectionTemplateDialogProps {
	onOpenChange: (open: boolean) => void;
	handleSave: (formatData: any) => void;
	template: any;
}

const schema = {
	type: "object",
	fields: [
		{
			name: "theme",
			label: "Tema",
			type: "text",
			required: true,
		},
		{
			name: "hero",
			label: "BannerHero",
			type: "object",
			fields: [
				{
					name: "label",
					label: "Label",
					type: "text",
					required: true,
				},
				{
					name: "title",
					label: "Título",
					type: "text",
					required: true,
				},
				{
					name: "description",
					label: "Descrição",
					type: "text",
					required: true,
				},
				{
					name: "image",
					label: "Imagem",
					type: "object",
					fields: [
						{
							name: "src",
							label: "Endereço da imagem",
							type: "text",
							required: true,
						},
						{
							name: "alt",
							label: "Texto alternativo",
							type: "text",
							required: true,
						},
					],
				},
				{
					name: "buttons",
					label: "Botões",
					type: "array",
					required: true,
					arrayType: {
						type: "object",
						fields: [
							{
								name: "label",
								label: "Label",
								type: "text",
								required: true,
							},
							{
								name: "url",
								label: "URL",
								type: "text",
								required: true,
							},
						],
					},
				},
			],
		},
	],
};

export function SectionTemplateDialog({
	onOpenChange,
	template,
	handleSave,
}: SectionTemplateDialogProps) {
	const [formData, setFormData] = useState<any>({});
	const parsedSchema = useMemo(() => {
		try {
			return typeof template.schema === "string"
				? JSON.parse(template.schema)
				: template.schema;
		} catch (error) {
			console.error("Erro ao fazer parse do schema:", error);
			return schema;
		}
	}, [template.schema]);

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
				{parsedSchema.fields?.map((field: any) => (
					<SectionTemplateRenderField
						key={field.name}
						field={field}
						formData={formData}
						setFormData={setFormData}
						schema={parsedSchema}
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
