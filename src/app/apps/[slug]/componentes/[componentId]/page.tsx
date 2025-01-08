"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import s from "./styles.module.scss";

import { Input, Textarea, DashboardLayout } from "@/components";
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

const MAX_NESTING_LEVEL = 5;

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

	useEffect(() => {
		if (isEditing) {
			loadComponent();
		}
	}, [params.componentId]);

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
				router.push(`/apps/${params.slug}/componentes`);
			}
		} catch (error) {
			console.error("Erro ao carregar componente:", error);
			toast.error("Erro ao carregar componente");
			router.push(`/apps/${params.slug}/componentes`);
		} finally {
			setLoading(false);
		}
	};

	const validateField = (field: Field): string[] => {
		const errors: string[] = [];
		if (!field.name)
			errors.push(`O campo "${field.label || "sem nome"}" precisa ter um nome`);
		if (!field.type)
			errors.push(
				`O campo "${field.label || field.name || "sem nome"}" precisa ter um tipo`,
			);
		if (
			field.type === "object" &&
			(!field.fields || field.fields.length === 0)
		) {
			errors.push(
				`O campo objeto "${field.label || field.name}" precisa ter pelo menos um campo filho`,
			);
		}
		return errors;
	};

	const collectFieldValues = (form: HTMLFormElement, prefix = ""): Field[] => {
		const fields: Field[] = [];
		const formData = new FormData(form);
		const fieldEntries = Array.from(formData.entries()).filter(([key]) =>
			key.startsWith(prefix ? `${prefix}field.` : "field."),
		);

		const fieldMap = new Map<number, Partial<Field>>();

		fieldEntries.forEach(([key, value]) => {
			const keyParts = key.split(".");
			const fieldIndex = Number.parseInt(
				keyParts[keyParts[0] === "field" ? 1 : 2],
			);
			const property = keyParts[keyParts.length - 1];

			if (!fieldMap.has(fieldIndex)) {
				fieldMap.set(fieldIndex, {});
			}

			const field = fieldMap.get(fieldIndex)!;
			switch (property) {
				case "name":
					field.name = value as string;
					break;
				case "type":
					field.type = value as Field["type"];
					break;
				case "label":
					field.label = value as string;
					break;
				case "required":
					field.required = value === "on";
					break;
			}

			// Se for um campo do tipo objeto, coleta os campos filhos
			if (field.type === "object") {
				const nestedPrefix = `${prefix}field.${fieldIndex}.`;
				field.fields = collectFieldValues(form, nestedPrefix);
			}
		});

		// Converte o Map para array e ordena pelo índice
		return Array.from(fieldMap.values()) as Field[];
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const form = e.target as HTMLFormElement;

			// Coleta os valores básicos do formulário
			const name = form.querySelector<HTMLInputElement>('[name="name"]')?.value;
			const description = form.querySelector<HTMLTextAreaElement>(
				'[name="description"]',
			)?.value;

			if (!name) {
				toast.error("O nome do componente é obrigatório");
				setLoading(false);
				return;
			}

			// Coleta todos os campos do formulário
			const fields = collectFieldValues(form);

			// Valida todos os campos
			const errors: string[] = [];
			fields.forEach((field) => {
				errors.push(...validateField(field));
			});

			if (errors.length > 0) {
				errors.forEach((error) => toast.error(error));
				setLoading(false);
				return;
			}

			const updatedFormData = {
				...formData,
				name,
				description: description || "",
				schema: {
					...formData.schema,
					fields,
				},
			};

			let result;
			if (isEditing) {
				result = await updateComponentService(
					params.slug as string,
					params.componentId as string,
					updatedFormData,
				);
			} else {
				result = await createComponentService(
					params.slug as string,
					updatedFormData,
				);
			}

			if (result.success) {
				toast.success(
					isEditing
						? "Componente atualizado com sucesso!"
						: "Componente criado com sucesso!",
				);
				router.push(`/apps/${params.slug}/componentes`);
			} else {
				if (Array.isArray(result?.error)) {
					result?.error.forEach((err) => {
						toast.error(err.message);
					});
				} else {
					toast.error(
						result.error?.message ||
							`Erro ao ${isEditing ? "atualizar" : "criar"} componente`,
					);
				}
			}
		} catch (error) {
			console.error(
				`Erro ao ${isEditing ? "atualizar" : "criar"} componente:`,
				error,
			);
			toast.error(
				`Erro ao ${isEditing ? "atualizar" : "criar"} componente. Tente novamente.`,
			);
		} finally {
			setLoading(false);
		}
	};

	const addField = (path: FieldPath = []) => {
		console.log("Adicionando campo:", { path });

		// Verifica se já atingiu o nível máximo
		if (getNestedLevel(path) >= MAX_NESTING_LEVEL) {
			toast.error(
				`Não é possível adicionar mais níveis. Máximo de ${MAX_NESTING_LEVEL} níveis permitido.`,
			);
			return;
		}

		const newField: Field = {
			name: "",
			type: "text",
			label: "",
			required: false,
		};

		setFormData((prev) => {
			const newFields = JSON.parse(JSON.stringify(prev.schema.fields));

			// Função auxiliar para adicionar campo em qualquer nível
			const addFieldAtPath = (
				fields: Field[],
				remainingPath: number[],
				currentLevel = 1,
			): Field[] => {
				if (remainingPath.length === 0) {
					return [...fields, newField];
				}

				const [currentIndex, ...restPath] = remainingPath;
				if (currentIndex >= fields.length) {
					console.log("Índice inválido:", currentIndex);
					return fields;
				}

				const updatedFields = [...fields];
				const targetField = updatedFields[currentIndex];

				// Verifica se é um campo de objeto ou array com tipo objeto
				if (targetField.type === "object") {
					targetField.fields = addFieldAtPath(
						targetField.fields || [],
						restPath,
						currentLevel + 1,
					);
				} else if (
					targetField.type === "array" &&
					targetField.arrayType?.type === "object"
				) {
					targetField.arrayType.fields = addFieldAtPath(
						targetField.arrayType.fields || [],
						restPath,
						currentLevel + 1,
					);
				} else {
					console.log("Campo não permite campos filhos:", targetField);
					return fields;
				}

				return updatedFields;
			};

			const updatedFields = addFieldAtPath(newFields, path);
			console.log("Campos atualizados:", updatedFields);

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
		console.log("Mudando tipo:", { path, type });

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
				if (remainingPath.length === 0) {
					return fields;
				}

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
			console.log("Campos atualizados após mudança de tipo:", updatedFields);

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
		console.log("Mudando tipo do array:", { path, type });

		// Verifica se pode adicionar mais níveis
		if (type === "object" && getNestedLevel(path) >= MAX_NESTING_LEVEL) {
			toast.error(
				`Não é possível adicionar mais níveis. Máximo de ${MAX_NESTING_LEVEL} níveis permitido.`,
			);
			return;
		}

		setFormData((prev) => {
			const newFields = JSON.parse(JSON.stringify(prev.schema.fields));

			const updateArrayTypeAtPath = (
				fields: Field[],
				remainingPath: number[],
				currentLevel = 1,
			): Field[] => {
				if (remainingPath.length === 0) {
					return fields;
				}

				const [currentIndex, ...restPath] = remainingPath;
				if (currentIndex >= fields.length) {
					return fields;
				}

				const updatedFields = [...fields];
				if (restPath.length === 0) {
					const targetField = updatedFields[currentIndex];
					if (targetField.type === "array" && targetField.arrayType) {
						targetField.arrayType.type = type;
						if (type === "object") {
							targetField.arrayType.fields = targetField.arrayType.fields || [];
						} else {
							delete targetField.arrayType.fields;
						}
					}
				} else {
					const targetField = updatedFields[currentIndex];
					if (targetField.type === "object" && targetField.fields) {
						targetField.fields = updateArrayTypeAtPath(
							targetField.fields,
							restPath,
							currentLevel + 1,
						);
					} else if (
						targetField.type === "array" &&
						targetField.arrayType?.fields
					) {
						targetField.arrayType.fields = updateArrayTypeAtPath(
							targetField.arrayType.fields,
							restPath,
							currentLevel + 1,
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
		console.log("Removendo campo:", { path });

		setFormData((prev) => {
			const newFields = JSON.parse(JSON.stringify(prev.schema.fields));

			// Função auxiliar para remover campo em qualquer nível
			const removeFieldAtPath = (
				fields: Field[],
				remainingPath: number[],
			): Field[] => {
				if (remainingPath.length === 0) {
					return fields;
				}

				const [currentIndex, ...restPath] = remainingPath;
				if (currentIndex >= fields.length) {
					return fields;
				}

				const updatedFields = [...fields];
				if (restPath.length === 0) {
					// Remover o campo neste nível
					updatedFields.splice(currentIndex, 1);
				} else {
					// Continue navegando
					const targetField = updatedFields[currentIndex];
					if (targetField.type === "object") {
						targetField.fields = removeFieldAtPath(
							targetField.fields || [],
							restPath,
						);
					}
				}

				return updatedFields;
			};

			const updatedFields = removeFieldAtPath(newFields, path);
			console.log("Campos atualizados após remoção:", updatedFields);

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
		console.log("Renderizando campo:", { field, path });

		const fieldId = `field.${path.join(".")}`;

		return (
			<div key={path.join(".")} className={s.fieldGroup}>
				<Input
					id={`${fieldId}.name`}
					name={`${fieldId}.name`}
					label="Nome do Campo"
					defaultValue={field.name}
					required
				/>
				<Input
					id={`${fieldId}.label`}
					name={`${fieldId}.label`}
					label="Label"
					defaultValue={field.label}
				/>
				<div className={s.fieldType}>
					<label>Tipo do Campo</label>
					<select
						id={`${fieldId}.type`}
						name={`${fieldId}.type`}
						defaultValue={field.type}
						onChange={(e) => handleTypeChange(path, e.target.value)}
					>
						<option value="text">Texto</option>
						<option value="number">Número</option>
						<option value="boolean">Booleano</option>
						<option value="date">Data</option>
						<option value="object">Objeto</option>
						<option value="array">Array</option>
					</select>
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
				</div>
				<button
					type="button"
					className={s.removeButton}
					onClick={() => removeField(path)}
				>
					Remover
				</button>

				{field.type === "array" && (
					<div className={s.arrayFields}>
						<h4>Configuração do Array</h4>
						<div className={s.arrayType}>
							<label>Tipo dos Itens</label>
							<select
								value={field.arrayType?.type || "text"}
								onChange={(e) => handleArrayTypeChange(path, e.target.value)}
							>
								<option value="text">Texto</option>
								<option value="number">Número</option>
								<option value="boolean">Booleano</option>
								<option value="date">Data</option>
								<option value="object">Objeto</option>
							</select>
						</div>
						{field.arrayType?.type === "object" && field.arrayType.fields && (
							<div className={s.arrayObjectFields}>
								<h5>Campos dos Itens do Array</h5>
								<div className={s.nestedFields}>
									{field.arrayType.fields.map((nestedField, index) =>
										renderField(nestedField, [...path, index]),
									)}
								</div>
								<button
									type="button"
									className={s.addNestedFieldButton}
									onClick={() => addField([...path])}
								>
									Adicionar Campo ao Item do Array
								</button>
							</div>
						)}
					</div>
				)}

				{field.type === "object" && (
					<div className={s.objectFields}>
						<h4>Campos do Objeto</h4>
						<div className={s.nestedFields}>
							{field.fields?.map((nestedField, index) =>
								renderField(nestedField, [...path, index]),
							)}
						</div>
						<button
							type="button"
							className={s.addNestedFieldButton}
							onClick={() => addField([...path])}
						>
							Adicionar Campo ao Objeto
						</button>
					</div>
				)}
			</div>
		);
	};

	return (
		<DashboardLayout slug={params.slug}>
			<div className={s.container}>
				<h1>{isEditing ? "Editar Componente" : "Novo Componente"}</h1>

				<form onSubmit={handleSubmit} className={s.form}>
					<div className={s.field}>
						<Input
							name="name"
							label="Nome do Componente"
							defaultValue={formData.name}
							required
						/>
					</div>

					<div className={s.field}>
						<Textarea
							name="description"
							label="Descrição"
							defaultValue={formData.description}
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
								onClick={() => addField()}
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
