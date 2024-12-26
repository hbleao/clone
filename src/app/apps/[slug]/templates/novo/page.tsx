"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import s from "./styles.module.scss";

import type { SectionTemplateType } from "@/types/section";
import { createSectionTemplate } from "@/actions/sectionTemplate";

import type { Field, FieldType } from "./types";
import { Input, Textarea } from "@/components";
import { createSectionTemplateService } from "@/services";

export default function NewTemplatePage() {
	const router = useRouter();
	const params = useParams();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<{
		name: string;
		type: SectionTemplateType;
		description: string;
		schema: {
			fields: Field[];
		};
	}>({
		name: "",
		type: "custom",
		description: "",
		schema: {
			fields: [],
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Validar se todos os campos obrigatórios estão preenchidos
			if (!formData.name || !formData.description) {
				toast.error("Preencha todos os campos obrigatórios");
				return;
			}

			// Validar se todos os campos do template têm nome e label
			const validateFields = (fields: Field[]): boolean => {
				return fields.every((field) => {
					if (!field.name || !field.label) {
						return false;
					}

					if (field.type === "object" && field.fields) {
						return validateFields(field.fields);
					}

					if (
						field.type === "array" &&
						field.arrayType?.type === "object" &&
						field.arrayType.fields
					) {
						return validateFields(field.arrayType.fields);
					}

					return true;
				});
			};

			if (!validateFields(formData.schema.fields)) {
				toast.error("Todos os campos precisam ter nome e label");
				return;
			}

			// Salvar template
			const result = await createSectionTemplateService(
				params.slug as string,
				formData,
			);

			// const result = await createSectionTemplate(
			// 	params.slug as string,
			// 	formData,
			// );

			if (result.success) {
				toast.success("Template criado com sucesso!");
				router.push(`/apps/${params.slug}/templates`);
			} else {
				if (Array.isArray(result.error)) {
					// Mostrar erros de validação do Zod
					result.error.forEach((err) => {
						toast.error(err.message);
					});
				} else {
					toast.error(result.error || "Erro ao criar template");
				}
			}
		} catch (error) {
			console.error("Erro ao salvar template:", error);
			toast.error("Erro ao criar template. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	const addField = (parentFields: Field[], parentIndex?: number) => {
		const newField: Field = {
			name: "",
			type: "text",
			label: "",
			required: false,
		};

		if (parentIndex !== undefined) {
			const newFields = [...formData.schema.fields];
			if (newFields[parentIndex].type === "object") {
				newFields[parentIndex].fields = [
					...(newFields[parentIndex].fields || []),
					newField,
				];
			} else if (
				newFields[parentIndex].type === "array" &&
				newFields[parentIndex].arrayType?.type === "object"
			) {
				newFields[parentIndex].arrayType.fields = [
					...(newFields[parentIndex].arrayType.fields || []),
					newField,
				];
			}
			setFormData((prev) => ({
				...prev,
				schema: { fields: newFields },
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				schema: {
					fields: [...prev.schema.fields, newField],
				},
			}));
		}
	};

	const handleFieldChange = (
		fieldIndex: number,
		value: string,
		isNested: boolean,
		parentIndex?: number,
		isArrayField?: boolean,
	) => {
		const newSchemaFields = [...formData.schema.fields];

		if (isNested && typeof parentIndex === "number") {
			const parentField = newSchemaFields[parentIndex];

			if (
				isArrayField &&
				parentField?.type === "array" &&
				parentField.arrayType?.type === "object"
			) {
				const arrayFields = [...(parentField.arrayType.fields || [])];
				arrayFields[fieldIndex] = {
					...arrayFields[fieldIndex],
					name: value,
				};
				parentField.arrayType.fields = arrayFields;
			} else if (parentField?.type === "object" && parentField.fields) {
				const nestedFields = [...parentField.fields];
				nestedFields[fieldIndex] = {
					...nestedFields[fieldIndex],
					name: value,
				};
				parentField.fields = nestedFields;
			}
		} else {
			newSchemaFields[fieldIndex] = {
				...newSchemaFields[fieldIndex],
				name: value,
			};
		}

		setFormData((prev) => ({
			...prev,
			schema: { fields: newSchemaFields },
		}));
	};

	const renderField = (
		field: Field,
		index: number,
		parentFields: Field[],
		isNested = false,
		parentIndex?: number,
		isArrayField?: boolean,
	) => {
		return (
			<div key={index} className={s.fieldGroup}>
				<div className={s.field}>
					<label>Nome do Campo</label>
					<input
						type="text"
						value={field.name}
						onChange={(e) =>
							handleFieldChange(
								index,
								e.target.value,
								isNested,
								parentIndex,
								isArrayField,
							)
						}
						required
					/>
				</div>

				<div className={s.field}>
					<label>Tipo do Campo</label>
					<select
						value={field.type}
						onChange={(e) => {
							const newType = e.target.value as FieldType;
							const newFields = [...parentFields];
							newFields[index] = {
								...field,
								type: newType,
								fields: newType === "object" ? [] : undefined,
								arrayType: newType === "array" ? { type: "text" } : undefined,
							};
							if (isNested) {
								const newSchemaFields = [...formData.schema.fields];
								if (newSchemaFields[parentIndex as number].type === "object") {
									newSchemaFields[parentIndex as number].fields = newFields;
								} else if (
									newSchemaFields[parentIndex as number].type === "array"
								) {
									newSchemaFields[parentIndex as number].arrayType!.fields =
										newFields;
								}
								setFormData((prev) => ({
									...prev,
									schema: { fields: newSchemaFields },
								}));
							} else {
								setFormData((prev) => ({
									...prev,
									schema: { fields: newFields },
								}));
							}
						}}
					>
						<option value="text">Texto</option>
						<option value="textarea">Área de Texto</option>
						<option value="number">Número</option>
						<option value="select">Seleção</option>
						<option value="image">Imagem</option>
						<option value="object">Objeto</option>
						<option value="array">Array</option>
					</select>
				</div>

				<div className={s.field}>
					<label>Label</label>
					<input
						type="text"
						value={field.label}
						onChange={(e) => {
							const newFields = [...parentFields];
							newFields[index].label = e.target.value;
							if (isNested) {
								const newSchemaFields = [...formData.schema.fields];
								if (newSchemaFields[parentIndex as number].type === "object") {
									newSchemaFields[parentIndex as number].fields = newFields;
								} else if (
									newSchemaFields[parentIndex as number].type === "array"
								) {
									newSchemaFields[parentIndex as number].arrayType!.fields =
										newFields;
								}
								setFormData((prev) => ({
									...prev,
									schema: { fields: newSchemaFields },
								}));
							} else {
								setFormData((prev) => ({
									...prev,
									schema: { fields: newFields },
								}));
							}
						}}
						required
					/>
				</div>

				<div className={s.fieldCheckbox}>
					<label>
						<input
							type="checkbox"
							checked={field.required}
							onChange={(e) => {
								const newFields = [...parentFields];
								newFields[index].required = e.target.checked;
								if (isNested) {
									const newSchemaFields = [...formData.schema.fields];
									if (
										newSchemaFields[parentIndex as number].type === "object"
									) {
										newSchemaFields[parentIndex as number].fields = newFields;
									} else if (
										newSchemaFields[parentIndex as number].type === "array"
									) {
										newSchemaFields[parentIndex as number].arrayType!.fields =
											newFields;
									}
									setFormData((prev) => ({
										...prev,
										schema: { fields: newSchemaFields },
									}));
								} else {
									setFormData((prev) => ({
										...prev,
										schema: { fields: newFields },
									}));
								}
							}}
						/>
						Campo Obrigatório
					</label>
				</div>

				{field.type === "object" && (
					<div className={s.nestedFields}>
						<h3>Campos do Objeto</h3>
						{field.fields?.map((nestedField, nestedIndex) =>
							renderField(
								nestedField,
								nestedIndex,
								field.fields || [],
								true,
								index,
							),
						)}
						<button
							type="button"
							onClick={() => addField(field.fields || [], index)}
							className={s.addNestedField}
						>
							Adicionar Campo ao Objeto
						</button>
					</div>
				)}

				{field.type === "array" && (
					<div className={s.nestedFields}>
						<div className={s.field}>
							<label>Tipo dos Itens do Array</label>
							<select
								value={field.arrayType?.type}
								onChange={(e) => {
									const newType = e.target.value as FieldType;
									const newFields = [...parentFields];
									newFields[index].arrayType = {
										type: newType,
										fields: newType === "object" ? [] : undefined,
									};
									if (isNested) {
										const newSchemaFields = [...formData.schema.fields];
										if (
											newSchemaFields[parentIndex as number].type === "object"
										) {
											newSchemaFields[parentIndex as number].fields = newFields;
										} else if (
											newSchemaFields[parentIndex as number].type === "array"
										) {
											newSchemaFields[parentIndex as number].arrayType!.fields =
												newFields;
										}
										setFormData((prev) => ({
											...prev,
											schema: { fields: newSchemaFields },
										}));
									} else {
										setFormData((prev) => ({
											...prev,
											schema: { fields: newFields },
										}));
									}
								}}
							>
								<option value="text">Texto</option>
								<option value="number">Número</option>
								<option value="object">Objeto</option>
							</select>
						</div>

						{field.arrayType?.type === "object" && (
							<div className={s.nestedFields}>
								<h3>Campos dos Objetos do Array</h3>
								{field.arrayType.fields?.map((nestedField, nestedIndex) =>
									renderField(
										nestedField,
										nestedIndex,
										field.arrayType?.fields || [],
										true,
										index,
										true,
									),
								)}
								<button
									type="button"
									onClick={() => addField(field.arrayType?.fields || [], index)}
									className={s.addNestedField}
								>
									Adicionar Campo aos Objetos do Array
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className={s.container}>
			<h1>Novo Template de Seção</h1>

			<form onSubmit={handleSubmit} className={s.form}>
				<div className={s.field}>
					<Input
						label="Nome do Template"
						value={formData.name}
						onChange={(value) =>
							setFormData((prev) => ({ ...prev, name: value }))
						}
						required
					/>
				</div>

				<div className={s.field}>
					<label>Tipo</label>
					<select
						value={formData.type}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								type: e.target.value as SectionTemplateType,
							}))
						}
					>
						<option value="hero">Base</option>
						<option value="hero">Hero</option>
						<option value="features">Features</option>
						<option value="testimonials">Depoimentos</option>
						<option value="custom">Personalizado</option>
					</select>
				</div>

				<div className={s.field}>
					<Textarea
						label="Descrição"
						value={formData.description}
						onChange={(value) =>
							setFormData((prev) => ({ ...prev, description: value }))
						}
						required
					/>
				</div>

				<div className={s.fields}>
					<h2>Campos do Template</h2>
					{formData.schema.fields.map((field, index) =>
						renderField(field, index, formData.schema.fields),
					)}

					<button
						type="button"
						onClick={() => addField(formData.schema.fields)}
						className={s.addField}
					>
						Adicionar Campo
					</button>
				</div>

				<div className={s.actions}>
					<button
						type="button"
						onClick={() => router.push(`/apps/${params.slug}/templates`)}
					>
						Cancelar
					</button>
					<button type="submit" disabled={loading}>
						{loading ? "Salvando..." : "Salvar Template"}
					</button>
				</div>
			</form>
		</div>
	);
}
