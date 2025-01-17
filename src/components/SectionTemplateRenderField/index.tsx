"use client";
import { Plus, Trash2 } from "lucide-react";

import s from "./styles.module.scss";

import { Button } from "@/components";
import { WysiwygEditor } from "../WysiwygEditor";
import type { SectionTemplateRenderFieldProps } from "./types";

export const SectionTemplateRenderField = ({
	field,
	formData,
	setFormData,
	schema,
}: SectionTemplateRenderFieldProps) => {
	const getNestedValue = (obj: any, path: string) => {
		// Se não houver pontos no caminho, é um campo simples
		if (!path.includes(".")) {
			return obj[path];
		}

		const parts = path.split(".");
		let current = obj;

		for (const part of parts) {
			if (current === undefined || current === null) {
				return undefined;
			}
			current = current[part];
		}

		return current;
	};

	const setNestedValue = (obj: any, path: string, value: any) => {
		// Se não houver pontos no caminho, é um campo simples
		if (!path.includes(".")) {
			obj[path] = value;
			return obj;
		}

		const parts = path.split(".");
		const lastPart = parts.pop()!;
		let current = obj;

		for (const part of parts) {
			if (!(part in current)) {
				// Se o próximo nível é um número, inicializa como array
				const nextPart = parts[parts.indexOf(part) + 1];
				current[part] = !isNaN(Number(nextPart)) ? [] : {};
			}
			current = current[part];
		}

		current[lastPart] = value;
		return obj;
	};

	const value = getNestedValue(formData, field.name);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleChange = (newValue: any) => {
		setFormData((prev) => {
			const newFormData = { ...prev };
			setNestedValue(newFormData, field.name, newValue);
			return newFormData;
		});
	};

	const handleArrayChange = (
		path: string,
		index: number,
		fieldName: string,
		value: string,
	) => {
		setFormData((prev) => {
			const newFormData = { ...prev };
			const array = getNestedValue(newFormData, path) || [];

			// Garante que o array tem o tamanho adequado
			while (array.length <= index) {
				array.push({});
			}

			array[index] = {
				...array[index],
				[fieldName]: value,
			};

			setNestedValue(newFormData, path, array);
			return newFormData;
		});
	};

	const handleAddArrayItem = (path: string) => {
		setFormData((prev) => {
			const newFormData = { ...prev };
			const array = getNestedValue(newFormData, path) || [];

			// Cria um novo item com campos vazios baseado no schema
			const newItem = {};
			const arrayField = findFieldByPath(schema, path);

			if (
				arrayField?.arrayType?.type === "object" &&
				arrayField.arrayType.fields
			) {
				arrayField.arrayType.fields.forEach((subField: any) => {
					newItem[subField.name] = "";
				});
			}

			array.push(newItem);
			setNestedValue(newFormData, path, array);
			return newFormData;
		});
	};

	const handleRemoveArrayItem = (path: string, index: number) => {
		setFormData((prev) => {
			const newFormData = { ...prev };
			const array = getNestedValue(newFormData, path) || [];
			array.splice(index, 1);
			setNestedValue(newFormData, path, array);
			return newFormData;
		});
	};

	const renderObjectFields = (objectField: any, parentPath = "") => {
		return (
			<div className={s.objectField}>
				{objectField.fields?.map((field: any) => {
					const fieldPath = parentPath
						? `${parentPath}.${field.name}`
						: field.name;
					return (
						<SectionTemplateRenderField
							key={field.name}
							field={field}
							formData={formData}
							setFormData={setFormData}
						/>
					);
				})}
			</div>
		);
	};

	const findFieldByPath = (schema: any, path: string): any => {
		if (!path) return null;

		const parts = path.split(".");
		let currentField = null;
		let currentSchema = schema;

		for (const part of parts) {
			if (!currentSchema?.fields) {
				return null;
			}

			currentField = currentSchema.fields.find((f: any) => f.name === part);
			if (currentField) {
				if (currentField.type === "object") {
					currentSchema = currentField;
				} else if (currentField.type === "array") {
					return currentField;
				}
			} else {
				return null;
			}
		}

		return currentField;
	};

	const renderWysiwygField = () => {
		return (
			<div className={s.wysiwygField}>
				<WysiwygEditor value={value || ""} onChange={handleChange} />
			</div>
		);
	};

	switch (field.type) {
		case "array":
			const arrayValue = getNestedValue(formData, field.name) || [];
			return (
				<div className={s.arrayField}>
					<div className={s.arrayHeader}>
						<label>
							{field.label}
							{field.required && <span className={s.required}>*</span>}
						</label>
						<Button
							type="button"
							variant="insurance"
							onClick={() => handleAddArrayItem(field.name)}
							className={s.addArrayButton}
						>
							<Plus className="h-4 w-4 mr-2" />
							Adicionar Item
						</Button>
					</div>

					{arrayValue.length > 0 ? (
						<div className={s.arrayItems}>
							{arrayValue.map((item: any, index: number) => (
								<div key={index} className={s.arrayItem}>
									<div className={s.arrayItemHeader}>
										<span>Item {index + 1}</span>
										<Button
											type="button"
											variant="ghost"
											className={s.removeButton}
											onClick={() => handleRemoveArrayItem(field.name, index)}
										>
											<Trash2 />
										</Button>
									</div>
									<div className={s.arrayItemFields}>
										{field.arrayType?.type === "object" &&
											field.arrayType.fields?.map((subField: any) => {
												const fieldPath = `${field.name}.${index}.${subField.name}`;
												return (
													<div key={subField.name} className={s.field}>
														<label htmlFor={fieldPath}>
															{subField.label}
															{subField.required && (
																<span className={s.required}>*</span>
															)}
														</label>
														<input
															type="text"
															id={fieldPath}
															name={fieldPath}
															value={item[subField.name] || ""}
															onChange={(e) =>
																handleArrayChange(
																	field.name,
																	index,
																	subField.name,
																	e.target.value,
																)
															}
															required={subField.required}
															className={s.input}
														/>
													</div>
												);
											})}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className={s.emptyArray}>
							<p>Nenhum item adicionado</p>
						</div>
					)}
				</div>
			);

		case "text":
			return (
				<div className={s.field}>
					<label htmlFor={field.name}>
						{field.label}
						{field.required && <span className={s.required}>*</span>}
					</label>
					<input
						type="text"
						id={field.name}
						name={field.name}
						value={value || ""}
						onChange={(e) => handleChange(e.target.value)}
						required={field.required}
						className={s.input}
					/>
				</div>
			);

		case "textarea":
			return (
				<div className={s.field}>
					<label htmlFor={field.name}>
						{field.label}
						{field.required && <span className={s.required}>*</span>}
					</label>
					<textarea
						id={field.name}
						name={field.name}
						value={value || ""}
						onChange={(e) => handleChange(e.target.value)}
						required={field.required}
						rows={4}
						className={s.input}
					/>
				</div>
			);

		case "number":
			return (
				<div className={s.field}>
					<label htmlFor={field.name}>
						{field.label}
						{field.required && <span className={s.required}>*</span>}
					</label>
					<input
						type="number"
						id={field.name}
						name={field.name}
						value={value || ""}
						onChange={(e) => handleChange(Number(e.target.value))}
						required={field.required}
						className={s.input}
					/>
				</div>
			);

		case "select":
			return (
				<div className={s.field}>
					<label htmlFor={field.name}>
						{field.label}
						{field.required && <span className={s.required}>*</span>}
					</label>
					<select
						id={field.name}
						name={field.name}
						value={value || ""}
						onChange={(e) => handleChange(e.target.value)}
						required={field.required}
						className={s.input}
					>
						<option value="">Selecione uma opção</option>
						{field.options?.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			);

		case "object":
			return renderObjectFields(field, field.name);

		case "wysiwyg":
			return renderWysiwygField();

		case "image":
			return (
				<div className={s.field}>
					<label htmlFor={field.name}>
						{field.label}
						{field.required && <span className={s.required}>*</span>}
					</label>
					<div className={s.imageField}>
						{value && (
							<div className={s.preview}>
								<img src={value} alt={field.label} />
							</div>
						)}
						<input
							type="text"
							id={field.name}
							name={field.name}
							value={value || ""}
							onChange={(e) => handleChange(e.target.value)}
							required={field.required}
							className={s.input}
							placeholder="URL da imagem"
						/>
					</div>
				</div>
			);

		default:
			return (
				<div className={s.field}>
					<label htmlFor={field.name}>
						{field.label}
						{field.required && <span className={s.required}>*</span>}
					</label>
					<input
						type="text"
						id={field.name}
						name={field.name}
						value={value || ""}
						onChange={(e) => handleChange(e.target.value)}
						required={field.required}
						className={s.input}
					/>
				</div>
			);
	}
};
