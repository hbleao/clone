"use client";
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

import s from "./styles.module.scss";

import { Button } from "@/components";
import { WysiwygEditor } from "../WysiwygEditor";
import type { SectionTemplateRenderFieldProps } from "./types";

export const SectionTemplateRenderField = ({
	field,
	formData,
	setFormData,
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

	const handleArrayChange = (index: number, fieldName: string, value: string) => {
		setFormData((prev) => {
			const newFormData = { ...prev };
			const array = getNestedValue(newFormData, field.name) || [];
			
			// Garante que o array tem o tamanho adequado
			while (array.length <= index) {
				array.push({});
			}
			
			array[index] = {
				...array[index],
				[fieldName]: value,
			};
			
			setNestedValue(newFormData, field.name, array);
			return newFormData;
		});
	};

	const handleObjectChange = (fieldName: string, value: string) => {
		setFormData((prev) => {
			const newFormData = { ...prev };
			const objectPath = field.name;
			const object = getNestedValue(newFormData, objectPath) || {};
			
			const newObject = {
				...object,
				[fieldName]: value,
			};
			
			setNestedValue(newFormData, objectPath, newObject);
			return newFormData;
		});
	};

	const handleAddArrayItem = () => {
		setFormData((prev) => {
			const newFormData = { ...prev };
			const array = getNestedValue(newFormData, field.name) || [];
			
			// Adiciona um novo item com os campos padrão
			const newItem = field.arrayType?.type === "object" && field.arrayType.fields
				? field.arrayType.fields.reduce((acc, subField) => {
					acc[subField.name] = "";
					return acc;
				}, {} as Record<string, any>)
				: {};
			
			array.push(newItem);
			
			setNestedValue(newFormData, field.name, array);
			return newFormData;
		});
	};

	const handleRemoveArrayItem = (index: number) => {
		setFormData((prev) => {
			const newFormData = { ...prev };
			const array = getNestedValue(newFormData, field.name) || [];
			
			array.splice(index, 1);
			
			setNestedValue(newFormData, field.name, array);
			return newFormData;
		});
	};

	const renderObjectFields = (objectField: any, parentPath: string = "") => {
		const objectValue = getNestedValue(formData, parentPath) || {};
		
		return (
			<div className={s.objectField}>
				{objectField.fields?.map((subField: any) => {
					const fieldPath = parentPath ? `${parentPath}.${subField.name}` : subField.name;
					
					if (subField.type === "object") {
						return (
							<div key={subField.name} className={s.nestedObject}>
								<label className={s.nestedLabel}>
									{subField.label}
									{subField.required && <span className={s.required}>*</span>}
								</label>
								{renderObjectFields(subField, fieldPath)}
							</div>
						);
					}
					
					return (
						<div key={subField.name} className={s.field}>
							<label htmlFor={fieldPath}>
								{subField.label}
								{subField.required && <span className={s.required}>*</span>}
							</label>
							<input
								type="text"
								id={fieldPath}
								name={fieldPath}
								value={objectValue[subField.name] || ""}
								onChange={(e) => handleObjectChange(subField.name, e.target.value)}
								required={subField.required}
								className={s.input}
							/>
						</div>
					);
				})}
			</div>
		);
	};

	const renderArrayFields = (arrayField: any, parentPath: string = "") => {
		const arrayValue = getNestedValue(formData, parentPath) || [];
		
		return (
			<div className={s.arrayField}>
				{arrayValue.map((item: any, index: number) => (
					<div key={index} className={s.arrayItem}>
						<div className={s.arrayItemHeader}>
							<span>Item {index + 1}</span>
							<Button
								type="button"
								variant="ghost"
								onClick={() => handleRemoveArrayItem(index)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
						<div className={s.arrayItemFields}>
							{arrayField.arrayType?.type === "object" &&
								arrayField.arrayType.fields?.map((subField: any) => {
									const fieldPath = `${parentPath}.${index}.${subField.name}`;
									
									if (subField.type === "object") {
										return (
											<div key={subField.name} className={s.nestedObject}>
												<label className={s.nestedLabel}>
													{subField.label}
													{subField.required && <span className={s.required}>*</span>}
												</label>
												{renderObjectFields(subField, fieldPath)}
											</div>
										);
									}
									
									return (
										<div key={subField.name} className={s.field}>
											<label htmlFor={fieldPath}>
												{subField.label}
												{subField.required && <span className={s.required}>*</span>}
											</label>
											<input
												type="text"
												id={fieldPath}
												name={fieldPath}
												value={item[subField.name] || ""}
												onChange={(e) =>
													handleArrayChange(index, subField.name, e.target.value)
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
				<Button type="button" variant="ghost" onClick={handleAddArrayItem}>
					<Plus className="h-4 w-4 mr-2" />
					Adicionar Item
				</Button>
			</div>
		);
	};

	switch (field.type) {
		case "text":
			return (
				<div className={s.inputContainer}>
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
				<div className={s.inputContainer}>
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
				<div className={s.inputContainer}>
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
				<div className={s.inputContainer}>
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

		case "array":
			return renderArrayFields(field, field.name);

		case "object":
			return renderObjectFields(field, field.name);

		case "wysiwyg":
			return (
				<div className={s.wysiwygField}>
					<WysiwygEditor value={value || ""} onChange={handleChange} />
				</div>
			);

		case "image":
			return (
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
			);

		default:
			return (
				<div className={s.inputContainer}>
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
