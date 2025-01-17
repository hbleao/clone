"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import s from "./styles.module.scss";

import { Input, Select, DashboardLayout } from "@/components";
import {
	createComponentService,
	getComponentService,
	updateComponentService,
} from "@/services";

import type { Field } from "./types";

export type FormData = {
	name: string;
	type: string;
	description: string;
	schema: {
		fields: Field[];
	};
};

type FieldPath = number[];

const createField = (initialProps: Partial<Field> = {}): Field => {
	const defaultField: Field = {
		name: "",
		type: "text",
		label: "",
		required: false,
	};

	return { ...defaultField, ...initialProps };
};

const MAX_NESTING_LEVEL = 4;

const getNestedLevel = (path: FieldPath): number => path.length;

export default function ComponentPage() {
	const router = useRouter();
	const params = useParams();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		name: "",
		type: "custom",
		description: "",
		schema: {
			fields: [],
		},
	});

	const isEditing = params.componentId !== "novo";

	const loadComponent = async () => {
		setLoading(true);
		try {
			const result = await getComponentService(
				params.slug as string,
				params.componentId as string,
			);

			if (result.success && result.data) {
				setFormData({
					name: result.data.name,
					type: result.data.type,
					description: result.data.description,
					schema: result.data.schema,
				});
			} else {
				toast.error(result.error?.message || "Erro ao carregar componente");
				// router.push(`/apps/${params.slug}/componentes`);
			}
		} catch (error) {
			console.error("Erro ao carregar componente:", error);
			toast.error("Erro ao carregar componente");
			router.push(`/apps/${params.slug}/componentes`);
		} finally {
			setLoading(false);
		}
	};

	const validateField = (field: Field, path = ""): string[] => {
		const errors: string[] = [];
		const fieldIdentifier = path
			? `${path} > ${field.label || field.name || "sem nome"}`
			: field.label || field.name || "sem nome";

		// Validação básica do nome
		if (!field.name?.trim()) {
			errors.push(`O campo "${fieldIdentifier}" precisa ter um nome`);
		}

		// Validação do tipo
		if (!field.type) {
			errors.push(`O campo "${fieldIdentifier}" precisa ter um tipo`);
		}

		// Validação de campos objeto
		if (field.type === "object") {
			if (!field.fields) {
				field.fields = []; // Inicializa array vazio se não existir
			}
			// Valida campos filhos
			field.fields.forEach((childField, index) => {
				errors.push(
					...validateField(
						childField,
						`${fieldIdentifier} > campo ${index + 1}`,
					),
				);
			});
		}

		// Validação de campos array
		if (field.type === "array") {
			if (!field.arrayType) {
				field.arrayType = createField({ type: "text" }); // Tipo padrão se não especificado
			}

			// Se for um array de objetos com campos
			if (
				field.arrayType.type === "object" &&
				"fields" in field.arrayType &&
				field.arrayType.fields?.length > 0
			) {
				field.arrayType.fields.forEach((templateField, index) => {
					errors.push(
						...validateField(
							templateField,
							`${fieldIdentifier} (template) > campo ${index + 1}`,
						),
					);
				});
			}
		}

		return errors;
	};

	const collectFieldValues = (form: HTMLFormElement): Field[] => {
		const formData = new FormData(form);
		const entries = Array.from(formData.entries()) as [string, string][];

		// Primeiro passo: Coletar todos os campos e seus valores
		const fieldsMap = new Map<string, Field>();

		for (const [key, value] of entries) {
			if (!key.startsWith("field.")) continue;

			const parts = key.split(".");
			const fieldPath = parts.slice(1, -1); // Remove 'field.' e a propriedade
			const property = parts[parts.length - 1];
			const pathKey = fieldPath.join(".");

			if (!fieldsMap.has(pathKey)) {
				fieldsMap.set(
					pathKey,
					createField({
						name: "",
						type: "text",
						label: "",
						required: false,
					}),
				);
			}

			const field = fieldsMap.get(pathKey)!;

			switch (property) {
				case "name":
					field.name = value;
					break;
				case "type":
					const newType = value as FieldType;
					field.type = newType;

					// Reiniciar estrutura baseado no tipo
					if (newType === "object") {
						(field as ObjectField).fields = [];
						delete (field as any).arrayType;
					} else if (newType === "array") {
						(field as ArrayField).arrayType = createField({
							type: "text",
							name: "arrayItem",
						});
						delete (field as any).fields;
					} else {
						delete (field as any).fields;
						delete (field as any).arrayType;
					}
					break;
				case "label":
					field.label = value;
					break;
				case "required":
					field.required = value === "on";
					break;
			}
		}

		// Segundo passo: Construir a estrutura hierárquica
		const buildHierarchy = () => {
			const rootFields: Field[] = [];
			const paths = Array.from(fieldsMap.keys()).sort();

			for (const path of paths) {
				const field = fieldsMap.get(path)!;
				const pathParts = path.split(".");

				const current = rootFields;
				let parent: Field | undefined;
				let lastArrayParent: Field | undefined;
				const inArrayObject = false;

				for (let i = 0; i < pathParts.length; i++) {
					const index = Number.parseInt(pathParts[i]);
					const isLast = i === pathParts.length - 1;

					// Se estamos no último índice, coloque o campo atual
					if (isLast) {
						if (inArrayObject) {
							// Lógica para adicionar em array de objetos
							if (lastArrayParent && lastArrayParent.type === "array") {
								const arrayType = lastArrayParent.arrayType;
								if (arrayType.type === "object") {
									(arrayType as ObjectField).fields.push(field);
								}
							}
						} else if (parent && parent.type === "object") {
							// Adicionar em objeto
							parent.fields.push(field);
						} else {
							// Adicionar na raiz
							current.push(field);
						}
					}
				}
			}

			return rootFields;
		};

		return buildHierarchy();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			console.log("🚀 Iniciando submissão do formulário de componente", {
				componentId: params.componentId,
				formData,
			});

			const payload = {
				name: formData.name,
				type: formData.type,
				description: formData.description || "",
				schema: {
					fields: formData.schema.fields.length > 0 ? formData.schema.fields : [],
				},
			};

			let result;
			if (isEditing) {
				result = await updateComponentService(
					params.componentId as string,
					payload,
				);
			} else {
				result = await createComponentService(params.slug as string, payload);
			}

			if (result.success) {
				console.log("✅ Componente salvo com sucesso", {
					componentId: result.data?.id,
				});
				toast.success(
					isEditing
						? "Componente atualizado com sucesso!"
						: "Componente criado com sucesso!",
				);
				router.push(`/apps/${params.slug}/componentes`);
			} else {
				console.error("❌ Erro na submissão do componente", { result });
				toast.error(
					result.error?.message ||
						`Erro ao ${isEditing ? "atualizar" : "criar"} componente`,
				);
			}
		} catch (error: any) {
			console.error("❌ Erro crítico na submissão", { error });
			toast.error(
				typeof error === "string"
					? error
					: error?.message && typeof error.message === "string"
						? error.message
						: `Erro ao ${isEditing ? "atualizar" : "criar"} componente. Tente novamente.`,
			);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (field: keyof FormData) => (value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const validateBasicFields = (data: FormData): string[] => {
		const errors: string[] = [];

		if (!data.name?.trim()) {
			errors.push("O nome do componente é obrigatório");
		}

		return errors;
	};

	const validateFields = (
		fields: Field[],
	): { isValid: boolean; message: string } => {
		for (let i = 0; i < fields.length; i++) {
			const field = fields[i];

			// Valida o nome do campo atual
			if (!field.name.trim()) {
				return {
					isValid: false,
					message: `O campo na posição ${i + 1} precisa ter um nome`,
				};
			}

			// Valida campos de objetos
			if (field.type === "object" && field.fields) {
				const result = validateFields(field.fields);
				if (!result.isValid) {
					return result;
				}
			}

			// Valida campos de arrays de objetos
			if (
				field.type === "array" &&
				field.arrayType?.type === "object" &&
				field.arrayType.fields
			) {
				const result = validateFields(field.arrayType.fields);
				if (!result.isValid) {
					return {
						isValid: false,
						message: `No template do array "${field.name}": ${result.message}`,
					};
				}
			}
		}

		return { isValid: true, message: "" };
	};

	const addField = (path: FieldPath) => {
		setFormData((prev) => {
			const newFields = JSON.parse(JSON.stringify(prev.schema.fields));

			const addFieldAtPath = (fields: Field[], path: number[]): Field[] => {
				const updatedFields = JSON.parse(JSON.stringify(fields));

				// Função para navegar e modificar campos aninhados
				const navigateAndModify = (
					currentFields: Field[],
					remainingPath: number[],
					depth = 0,
				): Field[] => {
					// Condição de parada para evitar recursão infinita
					if (depth > 10) return currentFields;

					// Se não há mais caminho para navegar, adiciona um novo campo
					if (remainingPath.length === 0) {
						return [
							...currentFields,
							{
								name: "",
								type: "text",
								label: "",
								required: false,
							},
						];
					}

					const [currentIndex, ...restPath] = remainingPath;

					// Verifica se o índice atual é válido
					if (currentIndex >= currentFields.length) return currentFields;

					const targetField = currentFields[currentIndex];

					// Lógica para campos de objeto
					if (targetField.type === "object") {
						targetField.fields = targetField.fields || [];

						// Se não há mais caminho, adiciona um novo campo
						if (restPath.length === 0) {
							targetField.fields.push({
								name: "",
								type: "text",
								label: "",
								required: false,
							});
						} else {
							// Continua navegando nos campos aninhados
							targetField.fields = navigateAndModify(
								targetField.fields,
								restPath,
								depth + 1,
							);
						}
					}
					// Lógica para campos de array com tipo objeto
					else if (
						targetField.type === "array" &&
						targetField.arrayType?.type === "object"
					) {
						targetField.arrayType.fields = targetField.arrayType.fields || [];

						// Se não há mais caminho, adiciona um novo campo ao template do array
						if (restPath.length === 0) {
							targetField.arrayType.fields.push({
								name: "",
								type: "text",
								label: "",
								required: false,
							});
						} else {
							// Continua navegando nos campos aninhados do array
							targetField.arrayType.fields = navigateAndModify(
								targetField.arrayType.fields,
								restPath,
								depth + 1,
							);
						}
					}

					return currentFields;
				};

				return navigateAndModify(updatedFields, path);
			};

			const updatedFields = addFieldAtPath(newFields, path);

			return {
				...prev,
				schema: {
					...prev.schema,
					fields: updatedFields,
				},
			};
		});
	};

	const handleTypeChange = (path: FieldPath, type: string) => {
		// Verifica se pode adicionar mais níveis
		if (
			(type === "object" || type === "array") &&
			getNestedLevel(path) >= MAX_NESTING_LEVEL
		) {
			toast.error(
				`Não é possível adicionar mais níveis. Máximo de ${MAX_NESTING_LEVEL} níveis permitido.`,
			);
			return;
		}

		setFormData((prev) => {
			const newFields = JSON.parse(JSON.stringify(prev.schema.fields));

			const updateFieldAtPath = (
				fields: Field[],
				remainingPath: number[],
				currentLevel = 1,
			): Field[] => {
				if (remainingPath.length === 0) return fields;

				const [currentIndex, ...restPath] = remainingPath;
				if (currentIndex >= fields.length) {
					return fields;
				}

				const updatedFields = [...fields];
				if (restPath.length === 0) {
					// Chegamos no campo alvo
					const targetField = updatedFields[currentIndex];

					targetField.type = type;

					if (type === "object") {
						targetField.fields = targetField.fields || [];
						delete targetField.arrayType;
					} else if (type === "array") {
						targetField.arrayType = {
							type: "text",
							fields: [],
						};
						delete targetField.fields;
					} else {
						delete targetField.fields;
						delete targetField.arrayType;
					}
				} else {
					// Continue navegando
					const targetField = updatedFields[currentIndex];

					if (targetField.type === "object" && targetField.fields) {
						targetField.fields = updateFieldAtPath(
							targetField.fields,
							restPath,
							currentLevel + 1,
						);
					} else if (
						targetField.type === "array" &&
						targetField.arrayType?.fields
					) {
						targetField.arrayType.fields = updateFieldAtPath(
							targetField.arrayType.fields,
							restPath,
							currentLevel + 1,
						);
					}
				}

				return updatedFields;
			};

			const updatedFields = updateFieldAtPath(newFields, path);

			return {
				...prev,
				schema: {
					...prev.schema,
					fields: updatedFields,
				},
			};
		});
	};

	const handleArrayTypeChange = (path: FieldPath, type: string) => {
		setFormData((prev) => {
			const newFields = JSON.parse(JSON.stringify(prev.schema.fields));

			const updateArrayTypeAtPath = (
				fields: Field[],
				remainingPath: number[],
			): Field[] => {
				if (remainingPath.length === 0) return fields;

				const [currentIndex, ...restPath] = remainingPath;
				if (currentIndex >= fields.length) return fields;

				const updatedFields = [...fields];
				const targetField = updatedFields[currentIndex];

				if (restPath.length === 0) {
					// Preserva os campos existentes se estiver mudando para objeto
					const existingFields =
						targetField.arrayType?.type === "object"
							? targetField.arrayType.fields
							: [];

					if (type === "object") {
						targetField.arrayType = {
							type: "object",
							fields: existingFields?.length
								? existingFields
								: [
										{
											name: "",
											type: "text",
											label: "",
											required: false,
										},
									],
						};
					} else if (type === "array") {
						targetField.arrayType = {
							type: "array",
							arrayType: {
								type: "text",
							},
						};
					} else {
						targetField.arrayType = {
							type,
						};
					}
				} else {
					if (targetField.type === "object" && targetField.fields) {
						targetField.fields = updateArrayTypeAtPath(
							targetField.fields,
							restPath,
						);
					} else if (
						targetField.type === "array" &&
						targetField.arrayType?.type === "object" &&
						targetField.arrayType.fields
					) {
						targetField.arrayType.fields = updateArrayTypeAtPath(
							targetField.arrayType.fields,
							restPath,
						);
					}
				}

				return updatedFields;
			};

			const updatedFields = updateArrayTypeAtPath(newFields, path);

			return {
				...prev,
				schema: {
					...prev.schema,
					fields: updatedFields,
				},
			};
		});
	};

	const removeField = (path: FieldPath) => {
		setFormData((prev) => {
			const newFields = JSON.parse(JSON.stringify(prev.schema.fields));

			const removeFieldAtPath = (
				fields: Field[],
				remainingPath: number[],
				currentPath: number[] = [],
			): Field[] => {
				if (remainingPath.length === 0) {
					return [];
				}

				const [currentIndex, ...restPath] = remainingPath;
				const newCurrentPath = [...currentPath, currentIndex];

				if (currentIndex >= fields.length) {
					return fields;
				}

				const updatedFields = [...fields];
				const targetField = updatedFields[currentIndex];

				if (restPath.length === 0) {
					// Chegamos no campo a ser removido
					updatedFields.splice(currentIndex, 1);
				} else {
					// Continue navegando
					if (targetField.type === "object") {
						targetField.fields = removeFieldAtPath(
							targetField.fields || [],
							restPath,
							newCurrentPath,
						);
					} else if (
						targetField.type === "array" &&
						targetField.arrayType?.type === "object"
					) {
						targetField.arrayType.fields = removeFieldAtPath(
							targetField.arrayType.fields || [],
							restPath,
							newCurrentPath,
						);
					}
				}

				return updatedFields;
			};

			const updatedFields = removeFieldAtPath(newFields, path);

			return {
				...prev,
				schema: {
					...prev.schema,
					fields: updatedFields,
				},
			};
		});
	};

	const handleFieldNameChange = (path: FieldPath, value: string) => {
		setFormData((prev) => {
			const newFields = JSON.parse(JSON.stringify(prev.schema.fields));

			const updateFieldNameAtPath = (
				fields: Field[],
				remainingPath: number[],
			): Field[] => {
				if (remainingPath.length === 0) return fields;

				const [currentIndex, ...restPath] = remainingPath;
				if (currentIndex >= fields.length) return fields;

				const updatedFields = [...fields];
				const targetField = updatedFields[currentIndex];

				if (restPath.length === 0) {
					targetField.name = value;
				} else {
					if (targetField.type === "object" && targetField.fields) {
						targetField.fields = updateFieldNameAtPath(
							targetField.fields,
							restPath,
						);
					} else if (
						targetField.type === "array" &&
						targetField.arrayType?.type === "object" &&
						targetField.arrayType.fields
					) {
						targetField.arrayType.fields = updateFieldNameAtPath(
							targetField.arrayType.fields,
							restPath,
						);
					}
				}

				return updatedFields;
			};

			const updatedFields = updateFieldNameAtPath(newFields, path);

			return {
				...prev,
				schema: {
					...prev.schema,
					fields: updatedFields,
				},
			};
		});
	};

	const handleFieldLabelChange = (path: FieldPath, value: string) => {
		setFormData((prev) => {
			const newFields = JSON.parse(JSON.stringify(prev.schema.fields));

			const updateFieldLabelAtPath = (
				fields: Field[],
				remainingPath: number[],
			): Field[] => {
				if (remainingPath.length === 0) return fields;

				const [currentIndex, ...restPath] = remainingPath;
				if (currentIndex >= fields.length) return fields;

				const updatedFields = [...fields];
				const targetField = updatedFields[currentIndex];

				if (restPath.length === 0) {
					targetField.label = value;
				} else {
					if (targetField.type === "object" && targetField.fields) {
						targetField.fields = updateFieldLabelAtPath(
							targetField.fields,
							restPath,
						);
					} else if (
						targetField.type === "array" &&
						targetField.arrayType?.type === "object" &&
						targetField.arrayType.fields
					) {
						targetField.arrayType.fields = updateFieldLabelAtPath(
							targetField.arrayType.fields,
							restPath,
						);
					}
				}

				return updatedFields;
			};

			const updatedFields = updateFieldLabelAtPath(newFields, path);

			return {
				...prev,
				schema: {
					...prev.schema,
					fields: updatedFields,
				},
			};
		});
	};

	const renderField = (field: Field, path: FieldPath) => {
		const currentPath = path.map(Number);
		const nestingLevel = currentPath.length;
		const fieldId = `field.${currentPath.join(".")}`;

		// Verifica se já atingimos o limite máximo de aninhamento
		const canNest = nestingLevel < MAX_NESTING_LEVEL;

		const fieldTypeOptions = [
			{ value: "text", label: "Texto (text)" },
			{ value: "textarea", label: "Área de Texto (textarea)" },
			{ value: "wysiwyg", label: "Editor de Texto Rico (wysiwyg)" },
			{ value: "number", label: "Número (number)" },
			{ value: "select", label: "Lista de Seleção (select)" },
			{ value: "boolean", label: "Sim/Não (boolean)" },
			{ value: "date", label: "Data (date)" },
			...(canNest
				? [
						{ value: "object", label: "Objeto (object)" },
						{ value: "array", label: "Lista (array)" },
					]
				: []),
		];

		return (
			<div key={currentPath.join(".")} className={s.fieldGroup}>
				<div className={s.fieldContent}>
					<div className={s.fieldInput}>
						<Input
							label="Nome do Campo"
							value={field.name || ""}
							onChange={(e) =>
								handleFieldNameChange(currentPath, e.target.value)
							}
						/>
					</div>
					<div className={s.fieldInput}>
						<Input
							label="Label"
							value={field.label || ""}
							onChange={(e) =>
								handleFieldLabelChange(currentPath, e.target.value)
							}
						/>
					</div>
				</div>
				<div className={s.fieldType}>
					<Select
						label="Tipo do Campo"
						options={fieldTypeOptions}
						value={field.type}
						onChange={(value) => handleTypeChange(currentPath, value)}
					/>
				</div>
				<div className={s.fieldRequired}>
					<label>
						<input
							type="checkbox"
							id={`${fieldId}.required`}
							name={`${fieldId}.required`}
							defaultChecked={field.required}
						/>
						Obrigatório
					</label>
					<button
						type="button"
						className={s.removeButton}
						onClick={() => removeField(currentPath)}
					>
						Remover
					</button>
				</div>

				{field.type === "array" && (
					<div className={s.arrayFields}>
						<h4>Configuração do Array</h4>
						<div className={s.arrayType}>
							<Select
								label="Tipo dos Itens"
								options={[
									{ value: "text", label: "Texto (text)" },
									{ value: "textarea", label: "Área de Texto (textarea)" },
									{ value: "wysiwyg", label: "Editor de Texto Rico (wysiwyg)" },
									{ value: "number", label: "Número (number)" },
									{ value: "select", label: "Lista de Seleção (select)" },
									{ value: "boolean", label: "Sim/Não (boolean)" },
									{ value: "date", label: "Data (date)" },
									...(canNest
										? [
												{ value: "object", label: "Objeto (object)" },
										  ]
										: []),
								]}
								value={field.arrayType?.type || "text"}
								onChange={(value) => handleArrayTypeChange(currentPath, value)}
							/>
						</div>
						{field.arrayType?.type === "object" && (
							<div className={s.arrayObjectFields}>
								<h5>Campos do Template do Array</h5>
								<div className={s.nestedFields}>
									{field.arrayType.fields?.map((nestedField, index) => {
										const nestedPath = [...currentPath, index];
										return renderField(nestedField, nestedPath);
									})}
								</div>
								<button
									type="button"
									className={s.addNestedFieldButton}
									onClick={() => addField(currentPath)}
								>
									Adicionar Campo ao Template
								</button>
							</div>
						)}
						{field.arrayType?.type === "array" && (
							<div className={s.arrayArrayFields}>
								<h5>Configuração do Array Interno</h5>
								<div className={s.nestedFields}>
									{/* Renderiza a configuração do array interno */}
									<div className={s.arrayType}>
										<Select
											label="Tipo dos Itens do Array Interno"
											options={[
												{ value: "text", label: "Texto (text)" },
												{
													value: "textarea",
													label: "Área de Texto (textarea)",
												},
												{
													value: "wysiwyg",
													label: "Editor de Texto Rico (wysiwyg)",
												},
												{ value: "number", label: "Número (number)" },
												{ value: "select", label: "Lista de Seleção (select)" },
												{ value: "boolean", label: "Sim/Não (boolean)" },
												{ value: "date", label: "Data (date)" },
												...(canNest
													? [{ value: "object", label: "Objeto (object)" }]
													: []),
											]}
											value={field.arrayType.arrayType?.type || "text"}
											onChange={(value) => {
												const newType = value;
												setFormData((prev) => {
													const newFields = JSON.parse(
														JSON.stringify(prev.schema.fields),
													);
													const targetField = getFieldAtPath(
														newFields,
														currentPath,
													);
													if (
														targetField?.type === "array" &&
														targetField.arrayType?.type === "array"
													) {
														targetField.arrayType.arrayType = {
															type: newType,
															...(newType === "object" && { fields: [] }),
														};
													}
													return {
														...prev,
														schema: {
															...prev.schema,
															fields: newFields,
														},
													};
												});
											}}
										/>
									</div>
									{field.arrayType.arrayType?.type === "object" && (
										<div className={s.nestedObjectFields}>
											<h6>Campos do Template do Array Interno</h6>
											<div className={s.nestedFields}>
												{field.arrayType.arrayType.fields?.map(
													(nestedField, index) => {
														const nestedPath = [...currentPath, index];
														return renderField(nestedField, nestedPath);
													},
												)}
											</div>
											<button
												type="button"
												className={s.addNestedFieldButton}
												onClick={() => addField(currentPath)}
											>
												Adicionar Campo ao Template
											</button>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				)}

				{field.type === "object" && (
					<div className={s.objectFields}>
						<h4>Campos do Objeto</h4>
						<div className={s.nestedFields}>
							{field.fields?.map((nestedField, index) => {
								const nestedPath = [...currentPath, index];
								return renderField(nestedField, nestedPath);
							})}
						</div>
						<button
							type="button"
							className={s.addNestedFieldButton}
							onClick={() => addField(currentPath)}
						>
							Adicionar Campo ao Objeto
						</button>
					</div>
				)}

				{field.type === "select" && (
					<div className={s.selectOptions}>
						<h4>Opções da Lista de Seleção</h4>
						{field.selectOptions?.map((option, index) => (
							<div key={index} className={s.selectOptionItem}>
								<Input
									label="Valor"
									value={option.value}
									onChange={(e) => {
										const newOptions = [...(field.selectOptions || [])];
										newOptions[index] = {
											...newOptions[index],
											value: e.target.value,
										};
										handleSelectOptionsChange(currentPath, newOptions);
									}}
								/>
								<Input
									label="Label"
									value={option.label}
									onChange={(e) => {
										const newOptions = [...(field.selectOptions || [])];
										newOptions[index] = {
											...newOptions[index],
											label: e.target.value,
										};
										handleSelectOptionsChange(currentPath, newOptions);
									}}
								/>
								<button
									type="button"
									onClick={() => {
										const newOptions = [...(field.selectOptions || [])];
										newOptions.splice(index, 1);
										handleSelectOptionsChange(currentPath, newOptions);
									}}
								>
									Remover
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={() => {
								const newOptions = [
									...(field.selectOptions || []),
									{ value: "", label: "" },
								];
								handleSelectOptionsChange(currentPath, newOptions);
							}}
						>
							Adicionar Opção
						</button>
					</div>
				)}
			</div>
		);
	};

	const getFieldAtPath = (fields: Field[], path: number[]): Field | null => {
		let current = fields;
		let currentField: Field | null = null;

		for (const index of path) {
			if (!current || index >= current.length) {
				return null;
			}

			currentField = current[index];
			if (currentField.type === "object") {
				current = currentField.fields || [];
			} else if (
				currentField.type === "array" &&
				currentField.arrayType?.type === "object"
			) {
				current = currentField.arrayType.fields || [];
			} else {
				break;
			}
		}

		return currentField;
	};

	const handleSelectOptionsChange = (path: FieldPath, options: any[]) => {
		setFormData((prev) => {
			const newFields = JSON.parse(JSON.stringify(prev.schema.fields));

			const updateSelectOptionsAtPath = (
				fields: Field[],
				remainingPath: number[],
			): Field[] => {
				if (remainingPath.length === 0) return fields;

				const [currentIndex, ...restPath] = remainingPath;
				if (currentIndex >= fields.length) return fields;

				const updatedFields = [...fields];
				const targetField = updatedFields[currentIndex];

				if (restPath.length === 0) {
					targetField.selectOptions = options;
				} else {
					if (targetField.type === "object" && targetField.fields) {
						targetField.fields = updateSelectOptionsAtPath(
							targetField.fields,
							restPath,
						);
					} else if (
						targetField.type === "array" &&
						targetField.arrayType?.type === "object" &&
						targetField.arrayType.fields
					) {
						targetField.arrayType.fields = updateSelectOptionsAtPath(
							targetField.arrayType.fields,
							restPath,
						);
					}
				}

				return updatedFields;
			};

			const updatedFields = updateSelectOptionsAtPath(newFields, path);

			return {
				...prev,
				schema: {
					...prev.schema,
					fields: updatedFields,
				},
			};
		});
	};

	useEffect(() => {
		if (isEditing) {
			loadComponent();
		}
	}, [params.componentId]);

	return (
		<DashboardLayout slug={params.slug}>
			<div className={s.container}>
				<h1>{isEditing ? "Editar Componente" : "Novo Componente"}</h1>

				<form onSubmit={handleSubmit} className={s.form}>
					<div className={`${s.field} ${s.filedSideBySide}`}>
						<Input
							name="name"
							label="Nome do Componente"
							value={formData.name}
							onChange={(e) => handleInputChange("name")(e.target.value)}
							required
						/>

						<Select
							label="Tipo do Componente"
							options={[
								{ value: "system", label: "Sistema" },
								{ value: "custom", label: "Custom" },
								{ value: "hero", label: "Hero" },
								{ value: "card", label: "Card" },
								{ value: "data", label: "Dados" },
							]}
							value={formData.type}
							onChange={(value) => {
								setFormData((prev) => ({
									...prev,
									type: value,
								}));
							}}
						/>
					</div>

					<div className={s.field}>
						<Input
							name="description"
							label="Descrição"
							value={formData.description}
							onChange={(e) => handleInputChange("description")(e.target.value)}
						/>
					</div>

					<div className={s.field}>
						<h3>Campos</h3>
						<div className={s.fields}>
							{formData.schema.fields.map((field, index) =>
								renderField(field, [index]),
							)}
							<button
								type="button"
								className={s.addFieldButton}
								onClick={() => addField([])}
							>
								Adicionar Campo
							</button>
						</div>
					</div>

					<div className={s.actions}>
						<button
							type="button"
							onClick={() => router.push(`/apps/${params.slug}/componentes`)}
						>
							Cancelar
						</button>
						<button type="submit" className="primary" disabled={loading}>
							{loading
								? "Salvando..."
								: isEditing
									? "Salvar Alterações"
									: "Salvar Componente"}
						</button>
					</div>
				</form>
			</div>
		</DashboardLayout>
	);
}
