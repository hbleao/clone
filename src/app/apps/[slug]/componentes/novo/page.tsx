"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import s from "./styles.module.scss";

import { Input, Textarea, Button } from "@/components";
import { createSectionTemplateService } from "@/services";

import type { SectionTemplateType } from "@/types/section";
import type { Field, FieldType, Option } from "./types";

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
		property: string,
		value: string | boolean,
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
					[property]: value,
				};
				parentField.arrayType.fields = arrayFields;
			} else if (parentField?.type === "object" && parentField.fields) {
				const nestedFields = [...parentField.fields];
				nestedFields[fieldIndex] = {
					...nestedFields[fieldIndex],
					[property]: value,
				};
				parentField.fields = nestedFields;
			}
		} else {
			newSchemaFields[fieldIndex] = {
				...newSchemaFields[fieldIndex],
				[property]: value,
			};
		}

		setFormData((prev) => ({
			...prev,
			schema: { fields: newSchemaFields },
		}));
	};

	const handleOptionChange = (
		fieldIndex: number,
		optionIndex: number,
		property: string,
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
				const arrayField = arrayFields[fieldIndex];
				if (arrayField.options) {
					arrayField.options[optionIndex] = {
						...arrayField.options[optionIndex],
						[property]: value,
					};
				}
				parentField.arrayType.fields = arrayFields;
			} else if (parentField?.type === "object" && parentField.fields) {
				const nestedFields = [...parentField.fields];
				const nestedField = nestedFields[fieldIndex];
				if (nestedField.options) {
					nestedField.options[optionIndex] = {
						...nestedField.options[optionIndex],
						[property]: value,
					};
				}
				parentField.fields = nestedFields;
			}
		} else {
			const field = newSchemaFields[fieldIndex];
			if (field.options) {
				field.options[optionIndex] = {
					...field.options[optionIndex],
					[property]: value,
				};
			}
		}

		setFormData((prev) => ({
			...prev,
			schema: { fields: newSchemaFields },
		}));
	};

	const handleRemoveOption = (
		fieldIndex: number,
		optionIndex: number,
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
				const arrayField = arrayFields[fieldIndex];
				if (arrayField.options) {
					arrayField.options.splice(optionIndex, 1);
				}
				parentField.arrayType.fields = arrayFields;
			} else if (parentField?.type === "object" && parentField.fields) {
				const nestedFields = [...parentField.fields];
				const nestedField = nestedFields[fieldIndex];
				if (nestedField.options) {
					nestedField.options.splice(optionIndex, 1);
				}
				parentField.fields = nestedFields;
			}
		} else {
			const field = newSchemaFields[fieldIndex];
			if (field.options) {
				field.options.splice(optionIndex, 1);
			}
		}

		setFormData((prev) => ({
			...prev,
			schema: { fields: newSchemaFields },
		}));
	};

	const handleAddOption = (
		fieldIndex: number,
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
				const arrayField = arrayFields[fieldIndex];
				if (!arrayField.options) {
					arrayField.options = [];
				}
				arrayField.options.push({ label: "", value: "" });
				parentField.arrayType.fields = arrayFields;
			} else if (parentField?.type === "object" && parentField.fields) {
				const nestedFields = [...parentField.fields];
				const nestedField = nestedFields[fieldIndex];
				if (!nestedField.options) {
					nestedField.options = [];
				}
				nestedField.options.push({ label: "", value: "" });
				parentField.fields = nestedFields;
			}
		} else {
			const field = newSchemaFields[fieldIndex];
			if (!field.options) {
				field.options = [];
			}
			field.options.push({ label: "", value: "" });
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
								"name",
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
					<label>Label</label>
					<input
						type="text"
						value={field.label}
						onChange={(e) =>
							handleFieldChange(
								index,
								"label",
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
					<label>Tipo</label>
					<select
						value={field.type}
						onChange={(e) =>
							handleFieldChange(
								index,
								"type",
								e.target.value,
								isNested,
								parentIndex,
								isArrayField,
							)
						}
						required
					>
						<option value="">Selecione</option>
						<option value="text">Texto</option>
						<option value="textarea">Texto Multilinha</option>
						<option value="wysiwyg">Editor de Texto</option>
						<option value="number">Número</option>
						<option value="select">Seleção</option>
						<option value="image">Imagem</option>
						<option value="object">Objeto</option>
						<option value="array">Lista</option>
					</select>
				</div>

				{field.type === "select" && (
					<div className={s.optionsField}>
						<label>Opções</label>
						<div className={s.optionsList}>
							{field.options?.map((option, optionIndex) => (
								<div key={optionIndex} className={s.optionItem}>
									<input
										type="text"
										placeholder="Label"
										value={option.label}
										onChange={(e) =>
											handleOptionChange(
												index,
												optionIndex,
												"label",
												e.target.value,
												isNested,
												parentIndex,
												isArrayField,
											)
										}
									/>
									<input
										type="text"
										placeholder="Valor"
										value={option.value}
										onChange={(e) =>
											handleOptionChange(
												index,
												optionIndex,
												"value",
												e.target.value,
												isNested,
												parentIndex,
												isArrayField,
											)
										}
									/>
									<Button
										type="button"
										onClick={() =>
											handleRemoveOption(
												index,
												optionIndex,
												isNested,
												parentIndex,
												isArrayField,
											)
										}
										variant="ghost"
										size="sm"
									>
										Remover
									</Button>
								</div>
							))}
							<Button
								type="button"
								onClick={() =>
									handleAddOption(
										index,
										isNested,
										parentIndex,
										isArrayField,
									)
								}
								variant="ghost"
								size="sm"
							>
								Adicionar Opção
							</Button>
						</div>
					</div>
				)}

				<div className={s.field}>
					<label className={s.checkboxLabel}>
						<input
							type="checkbox"
							checked={field.required}
							onChange={(e) =>
								handleFieldChange(
									index,
									"required",
									e.target.checked,
									isNested,
									parentIndex,
									isArrayField,
								)
							}
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
								onChange={(e) =>
									handleFieldChange(
										index,
										"arrayType.type",
										e.target.value,
										isNested,
										parentIndex,
										isArrayField,
									)
								}
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
