"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import s from "./styles.module.scss";

import { Input, Textarea, Button, DashboardLayout } from "@/components";
import { createComponent } from "@/actions/component";

import type { Field } from "./types";
import { createComponentService } from "@/services";

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
			if (!formData.name || !formData.description) {
				toast.error("Preencha todos os campos obrigatórios");
				return;
			}

			const result = await createComponentService(
				params.slug as string,
				formData,
			);

			if (result.success) {
				toast.success("Componente criado com sucesso!");
				router.push(`/apps/${params.slug}/componentes`);
			} else {
				if (Array.isArray(result?.error)) {
					result?.error.forEach((err) => {
						toast.error(err.message);
					});
				} else {
					toast.error(result.error || "Erro ao criar componente");
				}
			}
		} catch (error) {
			console.error("Erro ao criar componente:", error);
			toast.error("Erro ao criar componente. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	const addField = (
		parentFields: Field[],
		parentIndex?: number,
		isArrayField?: boolean,
	) => {
		const newField: Field = {
			name: "",
			type: "text",
			label: "",
			required: false,
		};

		if (parentIndex !== undefined) {
			const newFields = [...formData.schema.fields];
			if (isArrayField && newFields[parentIndex].type === "array") {
				// Se não tiver arrayType, inicializa com type 'object'
				if (!newFields[parentIndex].arrayType) {
					newFields[parentIndex].arrayType = {
						type: "object",
						fields: [],
					};
				}
				// Se não tiver fields, inicializa como array vazio
				if (!newFields[parentIndex].arrayType.fields) {
					newFields[parentIndex].arrayType.fields = [];
				}
				newFields[parentIndex].arrayType.fields = [
					...newFields[parentIndex].arrayType.fields!,
					newField,
				];
			} else if (newFields[parentIndex].type === "object") {
				// Se não tiver fields, inicializa como array vazio
				if (!newFields[parentIndex].fields) {
					newFields[parentIndex].fields = [];
				}
				newFields[parentIndex].fields = [
					...newFields[parentIndex].fields!,
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
		value: any,
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
				// Inicializa fields se não existir
				if (!parentField.arrayType.fields) {
					parentField.arrayType.fields = [];
				}

				const arrayFields = [...parentField.arrayType.fields];

				// Se o campo não existir, cria um novo
				if (!arrayFields[fieldIndex]) {
					arrayFields[fieldIndex] = {
						name: "",
						type: "text",
						label: "",
						required: false,
					};
				}

				// Se a propriedade contém um ponto, é uma propriedade aninhada
				if (property.includes(".")) {
					const [parentProp, childProp] = property.split(".");
					arrayFields[fieldIndex][parentProp] = {
						...arrayFields[fieldIndex][parentProp],
						[childProp]: value,
					};
				} else {
					// Atualiza a propriedade
					arrayFields[fieldIndex] = {
						...arrayFields[fieldIndex],
						[property]: value,
					};
				}

				// Se mudou o tipo, reseta as propriedades específicas
				if (property === "type") {
					const newType = value as FieldType;
					if (newType === "object") {
						arrayFields[fieldIndex].fields = [];
						delete arrayFields[fieldIndex].options;
						delete arrayFields[fieldIndex].arrayType;
					} else if (newType === "array") {
						arrayFields[fieldIndex].arrayType = {
							type: "text",
							fields: [],
						};
						delete arrayFields[fieldIndex].fields;
						delete arrayFields[fieldIndex].options;
					} else if (newType === "select") {
						arrayFields[fieldIndex].options = [];
						delete arrayFields[fieldIndex].fields;
						delete arrayFields[fieldIndex].arrayType;
					} else {
						delete arrayFields[fieldIndex].fields;
						delete arrayFields[fieldIndex].arrayType;
						delete arrayFields[fieldIndex].options;
					}
				}

				parentField.arrayType.fields = arrayFields;
			} else if (parentField?.type === "object") {
				// Inicializa fields se não existir
				if (!parentField.fields) {
					parentField.fields = [];
				}

				const nestedFields = [...parentField.fields];

				// Se o campo não existir, cria um novo
				if (!nestedFields[fieldIndex]) {
					nestedFields[fieldIndex] = {
						name: "",
						type: "text",
						label: "",
						required: false,
					};
				}

				// Se a propriedade contém um ponto, é uma propriedade aninhada
				if (property.includes(".")) {
					const [parentProp, childProp] = property.split(".");
					nestedFields[fieldIndex][parentProp] = {
						...nestedFields[fieldIndex][parentProp],
						[childProp]: value,
					};
				} else {
					// Atualiza a propriedade
					nestedFields[fieldIndex] = {
						...nestedFields[fieldIndex],
						[property]: value,
					};
				}

				// Se mudou o tipo, reseta as propriedades específicas
				if (property === "type") {
					const newType = value as FieldType;
					if (newType === "object") {
						nestedFields[fieldIndex].fields = [];
						delete nestedFields[fieldIndex].options;
						delete nestedFields[fieldIndex].arrayType;
					} else if (newType === "array") {
						nestedFields[fieldIndex].arrayType = {
							type: "text",
							fields: [],
						};
						delete nestedFields[fieldIndex].fields;
						delete nestedFields[fieldIndex].options;
					} else if (newType === "select") {
						nestedFields[fieldIndex].options = [];
						delete nestedFields[fieldIndex].fields;
						delete nestedFields[fieldIndex].arrayType;
					} else {
						delete nestedFields[fieldIndex].fields;
						delete nestedFields[fieldIndex].arrayType;
						delete nestedFields[fieldIndex].options;
					}
				}

				parentField.fields = nestedFields;
			}
		} else {
			// Se o campo não existir, cria um novo
			if (!newSchemaFields[fieldIndex]) {
				newSchemaFields[fieldIndex] = {
					name: "",
					type: "text",
					label: "",
					required: false,
				};
			}

			// Se a propriedade contém um ponto, é uma propriedade aninhada
			if (property.includes(".")) {
				const [parentProp, childProp] = property.split(".");
				newSchemaFields[fieldIndex][parentProp] = {
					...newSchemaFields[fieldIndex][parentProp],
					[childProp]: value,
				};
			} else {
				// Atualiza a propriedade
				newSchemaFields[fieldIndex] = {
					...newSchemaFields[fieldIndex],
					[property]: value,
				};
			}

			// Se mudou o tipo, reseta as propriedades específicas
			if (property === "type") {
				const newType = value as FieldType;
				if (newType === "object") {
					newSchemaFields[fieldIndex].fields = [];
					delete newSchemaFields[fieldIndex].options;
					delete newSchemaFields[fieldIndex].arrayType;
				} else if (newType === "array") {
					newSchemaFields[fieldIndex].arrayType = {
						type: "text",
						fields: [],
					};
					delete newSchemaFields[fieldIndex].fields;
					delete newSchemaFields[fieldIndex].options;
				} else if (newType === "select") {
					newSchemaFields[fieldIndex].options = [];
					delete newSchemaFields[fieldIndex].fields;
					delete newSchemaFields[fieldIndex].arrayType;
				} else {
					delete newSchemaFields[fieldIndex].fields;
					delete newSchemaFields[fieldIndex].arrayType;
					delete newSchemaFields[fieldIndex].options;
				}
			}
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
						<option value="date">Data</option>
						<option value="datetime">Data e Hora</option>
						<option value="time">Hora</option>
						<option value="boolean">Sim/Não</option>
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
										variant="danger"
										size="sm"
									>
										Remover
									</Button>
								</div>
							))}
							<Button
								type="button"
								onClick={() =>
									handleAddOption(index, isNested, parentIndex, isArrayField)
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
								false,
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
								value={field.arrayType?.type || "text"}
								onChange={(e) => {
									const newType = e.target.value as FieldType;
									// Inicializa as propriedades corretas para o novo tipo
									const newArrayType = {
										type: newType,
										fields: newType === "object" ? [] : undefined,
									};
									handleFieldChange(
										index,
										"arrayType",
										newArrayType,
										isNested,
										parentIndex,
										isArrayField,
									);
								}}
							>
								<option value="text">Texto</option>
								<option value="textarea">Texto Multilinha</option>
								<option value="wysiwyg">Editor de Texto</option>
								<option value="number">Número</option>
								<option value="select">Seleção</option>
								<option value="image">Imagem</option>
								<option value="object">Objeto</option>
								<option value="date">Data</option>
								<option value="datetime">Data e Hora</option>
								<option value="time">Hora</option>
								<option value="boolean">Sim/Não</option>
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
									onClick={() =>
										addField(field.arrayType?.fields || [], index, true)
									}
									className={s.addNestedField}
								>
									Adicionar Campo aos Objetos do Array
								</button>
							</div>
						)}
					</div>
				)}

				<Button
					type="button"
					onClick={() => {
						const newFields = [...parentFields];
						newFields.splice(index, 1);
						if (isNested && typeof parentIndex === "number") {
							const newSchemaFields = [...formData.schema.fields];
							if (
								isArrayField &&
								newSchemaFields[parentIndex].type === "array"
							) {
								newSchemaFields[parentIndex].arrayType!.fields = newFields;
							} else if (newSchemaFields[parentIndex].type === "object") {
								newSchemaFields[parentIndex].fields = newFields;
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
					variant="ghost"
					size="sm"
				>
					Remover Campo
				</Button>
			</div>
		);
	};

	return (
		<DashboardLayout slug={params.slug}>
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
						<h2>Campos do Componente</h2>
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
		</DashboardLayout>
	);
}
