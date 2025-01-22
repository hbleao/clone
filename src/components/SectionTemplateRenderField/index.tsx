"use client";
import { Plus, Trash2 } from "lucide-react";
import s from "./styles.module.scss";
import { Button, Select, Switch } from "@/components";
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

	const renderNestedField = (
		field: any,
		path: string,
		value: any,
		onChange: (value: any) => void
	) => {
		switch (field.type) {
			case "text":
				return (
					<input
						type="text"
						value={value || ""}
						onChange={(e) => onChange(e.target.value)}
						className={s.input}
					/>
				);

			case "textarea":
				return (
					<textarea
						value={value || ""}
						onChange={(e) => onChange(e.target.value)}
						className={s.textarea}
					/>
				);

			case "wysiwyg":
				return (
					<WysiwygEditor
						value={value || ""}
						onChange={(content) => onChange(content)}
					/>
				);

			case "number":
				return (
					<input
						type="number"
						value={value || ""}
						onChange={(e) => onChange(e.target.value)}
						className={s.input}
					/>
				);

			case "select":
				return (
					<Select
						options={
							field.selectOptions?.map((opt: any) => ({
								value: opt.value,
								label: opt.label,
							})) || []
						}
						value={value || ""}
						onChange={(value) => onChange(value)}
					/>
				);

			case "boolean":
				return (
					<div className={s.switchContainer}>
						<Switch
							checked={value || false}
							onCheckedChange={(checked) => onChange(checked)}
						/>
						<label className={s.switchLabel}>{field.label}</label>
					</div>
				);

			default:
				return null;
		}
	};

	const renderField = () => {
		switch (field.type) {
			case "text":
				return (
					<input
						type="text"
						value={value || ""}
						onChange={(e) => handleChange(e.target.value)}
						className={s.input}
					/>
				);

			case "textarea":
				return (
					<textarea
						value={value || ""}
						onChange={(e) => handleChange(e.target.value)}
						className={s.textarea}
					/>
				);

			case "wysiwyg":
				return (
					<WysiwygEditor
						value={value || ""}
						onChange={(content) => handleChange(content)}
					/>
				);

			case "number":
				return (
					<input
						type="number"
						value={value || ""}
						onChange={(e) => handleChange(e.target.value)}
						className={s.input}
					/>
				);

			case "select":
				return (
					<Select
						options={
							field.selectOptions?.map((opt: any) => ({
								value: opt.value,
								label: opt.label,
							})) || []
						}
						value={value || ""}
						onChange={(value) => handleChange(value)}
					/>
				);

			case "boolean":
				return (
					<div className={s.switchContainer}>
						<Switch
							checked={value || false}
							onCheckedChange={(checked) => handleChange(checked)}
						/>
						<label className={s.switchLabel}>{field.label}</label>
					</div>
				);

			case "array":
				const arrayValue = value || [];
				return (
					<div className={s.arrayContainer}>
						{arrayValue.map((item: any, index: number) => (
							<div key={index} className={s.arrayItem}>
								{field.arrayType?.type === "object" ? (
									<div className={s.objectFields}>
										{field.arrayType.fields?.map((nestedField: any) => (
											<div key={nestedField.name} className={s.field}>
												<label>{nestedField.label}</label>
												{renderNestedField(
													nestedField,
													`${field.name}.${index}`,
													item[nestedField.name],
													(value) =>
														handleArrayChange(
															field.name,
															index,
															nestedField.name,
															value,
														),
												)}
											</div>
										))}
									</div>
								) : (
									renderNestedField(
										{ ...field.arrayType, name: field.name },
										`${field.name}.${index}`,
										item,
										(value) =>
											handleArrayChange(field.name, index, "value", value),
									)
								)}
								<Button
									type="button"
									variant="danger"
									onClick={() => handleRemoveArrayItem(field.name, index)}
								>
									<Trash2 size={16} />
									Remover
								</Button>
							</div>
						))}
						<Button
							type="button"
							onClick={() => handleAddArrayItem(field.name)}
							className={s.addButton}
						>
							<Plus size={16} />
							Adicionar Item
						</Button>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className={s.fieldContainer}>
			{field.type !== "boolean" && <label>{field.label}</label>}
			{renderField()}
		</div>
	);
};
