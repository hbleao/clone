"use client";

import React, { useState } from "react";
import type { FormElementInstance } from "@/components/FormElements";
import { usePageBuilder } from "@/hooks";
import type { SectionTemplate } from "@/types/section";
import { Button } from "@/components";
import { Plus, Trash } from "lucide-react";

import s from "./styles.module.scss";

interface PropertiesComponentProps {
	elementInstance: FormElementInstance;
}

export function PropertiesComponent({
	elementInstance,
}: PropertiesComponentProps) {
	const { updateElement } = usePageBuilder();
	const element = elementInstance;

	// Verifica e faz parse do conteúdo
	let initialContent = {};
	try {
		initialContent =
			typeof element.extraAttributes?.content === "string"
				? JSON.parse(element.extraAttributes.content)
				: element.extraAttributes?.content || {};
	} catch (error) {
		console.error("Erro ao fazer parse do conteúdo:", error);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [formData, setFormData] = useState<Record<string, any>>(initialContent);

	const template = element.extraAttributes?.template as SectionTemplate;

	// Verifica e faz parse do schema
	let parsedSchema = null;
	try {
		parsedSchema =
			typeof template?.schema === "string"
				? JSON.parse(template.schema)
				: template?.schema;
	} catch (error) {
		console.error("Erro ao fazer parse do schema:", error);
	}

	if (!template || !parsedSchema) return null;

	const handleChange = (fieldName: string, value: any) => {
		const newFormData = {
			...formData,
			[fieldName]: value,
		};

		setFormData(newFormData);
		updateElement(element.id, {
			...element,
			extraAttributes: {
				...element.extraAttributes,
				content: JSON.stringify(newFormData),
			},
		});
	};

	const handleArrayFieldChange = (
		fieldName: string,
		index: number,
		subFieldName: string,
		value: any,
	) => {
		const currentArray = formData[fieldName] || [];
		const newArray = [...currentArray];
		newArray[index] = {
			...newArray[index],
			[subFieldName]: value,
		};

		handleChange(fieldName, newArray);
	};

	const handleAddArrayItem = (fieldName: string, arrayType: any) => {
		const currentArray = formData[fieldName] || [];
		const newItem = arrayType.fields.reduce(
			(acc: Record<string, any>, field: any) => {
				acc[field.name] = "";
				return acc;
			},
			{},
		);

		handleChange(fieldName, [...currentArray, newItem]);
	};

	const handleRemoveArrayItem = (fieldName: string, index: number) => {
		const currentArray = formData[fieldName] || [];
		const newArray = currentArray.filter((_: any, i: number) => i !== index);
		handleChange(fieldName, newArray);
	};

	const renderArrayField = (field: any) => {
		const values = formData[field.name] || [];
		const arrayType = field.arrayType;

		return (
			<div key={field.name} className={s.arrayFieldContainer}>
				<span className={s.arrayFieldLabel}>{field.label}</span>
				<div className={s.arrayFieldContainer}>
					{values.map((item: any, index: number) => (
						<div key={item} className={s.arrayItemContainer}>
							<button
								type="button"
								onClick={() => handleRemoveArrayItem(field.name, index)}
								className={s.removeButton}
							>
								<Trash />
							</button>
							<div className={s.arrayFieldContainer}>
								{arrayType.fields.map((subField: any) => (
									<div key={subField.name} className={s.fieldContainer}>
										<span className={s.fieldLabel}>{subField.label}</span>
										<input
											type={subField.type === "number" ? "number" : "text"}
											value={item[subField.name] || ""}
											onChange={(e) =>
												handleArrayFieldChange(
													field.name,
													index,
													subField.name,
													subField.type === "number"
														? Number(e.target.value)
														: e.target.value,
												)
											}
											className={s.input}
											required={subField.required}
										/>
									</div>
								))}
							</div>
						</div>
					))}
					<Button
						type="button"
						onClick={() => handleAddArrayItem(field.name, arrayType)}
						width="contain"
					>
						<Plus />
						Adicionar {field.label}
					</Button>
				</div>
			</div>
		);
	};

	const renderField = (field: any) => {
		console.log("Rendering field:", field);
		const value = formData[field.name] || "";

		switch (field.type) {
			case "array":
				return renderArrayField(field);

			case "text":
				return (
					<div key={field.name} className={s.fieldContainer}>
						<label htmlFor={field.name} className={s.fieldLabel}>
							{field.label}
						</label>
						<input
							type="text"
							id={field.name}
							value={value}
							onChange={(e) => handleChange(field.name, e.target.value)}
							className={s.input}
							required={field.required}
						/>
					</div>
				);

			case "textarea":
				return (
					<div key={field.name} className={s.fieldContainer}>
						<label htmlFor={field.name} className={s.fieldLabel}>
							{field.label}
						</label>
						<textarea
							id={field.name}
							value={value}
							onChange={(e) => handleChange(field.name, e.target.value)}
							className={s.textarea}
							required={field.required}
						/>
					</div>
				);

			case "number":
				return (
					<div key={field.name} className={s.fieldContainer}>
						<label htmlFor={field.name} className={s.fieldLabel}>
							{field.label}
						</label>
						<input
							type="number"
							id={field.name}
							value={value}
							onChange={(e) => handleChange(field.name, Number(e.target.value))}
							className={s.input}
							required={field.required}
						/>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className={s.container}>
			{parsedSchema.fields.map((field: any) => renderField(field))}
		</div>
	);
}
