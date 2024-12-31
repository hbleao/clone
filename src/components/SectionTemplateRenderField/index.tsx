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
	const value = formData[field.name];

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleChange = (newValue: any) => {
		setFormData((prev) => ({
			...prev,
			[field.name]: newValue,
		}));
	};

	const handleArrayChange = (index: number, fieldName: string, value: string) => {
		const newArray = [...(formData[field.name] || [])];
		if (!newArray[index]) {
			newArray[index] = {};
		}
		newArray[index] = {
			...newArray[index],
			[fieldName]: value,
		};
		handleChange(newArray);
	};

	const handleAddArrayItem = () => {
		const newArray = [...(formData[field.name] || [])];
		newArray.push({});
		handleChange(newArray);
	};

	const handleRemoveArrayItem = (index: number) => {
		const newArray = [...(formData[field.name] || [])];
		newArray.splice(index, 1);
		handleChange(newArray);
	};

	const handleObjectChange = (fieldName: string, value: string) => {
		const newObject = {
			...(formData[field.name] || {}),
			[fieldName]: value,
		};
		handleChange(newObject);
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
			return (
				<div className={s.arrayField}>
					{(value || []).map((item: Record<string, string>, index: number) => (
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
								{field.arrayType?.type === "object" &&
									field.arrayType.fields?.map((subField) => (
										<div key={subField.name} className={s.field}>
											<label htmlFor={`${field.name}.${index}.${subField.name}`}>
												{subField.label}
												{subField.required && (
													<span className={s.required}>*</span>
												)}
											</label>
											<input
												type="text"
												id={`${field.name}.${index}.${subField.name}`}
												name={`${field.name}.${index}.${subField.name}`}
												value={item[subField.name] || ""}
												onChange={(e) =>
													handleArrayChange(index, subField.name, e.target.value)
												}
												required={subField.required}
												className={s.input}
											/>
										</div>
									))}
							</div>
						</div>
					))}
					<Button type="button" variant="ghost" onClick={handleAddArrayItem}>
						<Plus className="h-4 w-4 mr-2" />
						Adicionar Item
					</Button>
				</div>
			);

		case "object":
			return (
				<div className={s.objectField}>
					{field.fields?.map((subField) => (
						<div key={subField.name} className={s.field}>
							<label htmlFor={`${field.name}.${subField.name}`}>
								{subField.label}
								{subField.required && <span className={s.required}>*</span>}
							</label>
							<input
								type="text"
								id={`${field.name}.${subField.name}`}
								name={`${field.name}.${subField.name}`}
								value={(value || {})[subField.name] || ""}
								onChange={(e) => handleObjectChange(subField.name, e.target.value)}
								required={subField.required}
								className={s.input}
							/>
						</div>
					))}
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
				</div>
			);

		case "wysiwyg":
			return (
				<WysiwygEditor
					value={value || ""}
					onChange={handleChange}
				/>
			);

		default:
			return null;
	}
};
