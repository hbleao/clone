"use client";

import React, { useState } from "react";
import type { FormElementInstance } from "@/components/FormElements";
import { useDesigner } from "@/hooks";
import type { SectionTemplate } from "@/types";
import { Button } from "@/components";
import { Plus, Trash } from "lucide-react";

interface PropertiesComponentProps {
	elementInstance: FormElementInstance;
}

export function PropertiesComponent({ elementInstance }: PropertiesComponentProps) {
	const { updateElement } = useDesigner();
	const element = elementInstance;
	const [formData, setFormData] = useState<Record<string, any>>(
		element.extraAttributes?.content ? JSON.parse(element.extraAttributes.content) : {}
	);

	const template = element.extraAttributes?.template as SectionTemplate;
	const schema = typeof template?.schema === "string" ? JSON.parse(template.schema) : template?.schema;
	
	console.log('Template:', template);
	console.log('Schema:', schema);
	console.log('Fields:', schema?.fields);
	
	if (!template || !schema) return null;

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

	const handleArrayFieldChange = (fieldName: string, index: number, subFieldName: string, value: any) => {
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
		const newItem = arrayType.fields.reduce((acc: Record<string, any>, field: any) => {
			acc[field.name] = "";
			return acc;
		}, {});

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
			<div key={field.name} className="flex flex-col gap-4">
				<label className="text-sm font-medium text-gray-700">
					{field.label}
				</label>
				<div className="flex flex-col gap-4">
					{values.map((item: any, index: number) => (
						<div key={index} className="flex flex-col gap-2 p-4 border border-gray-200 rounded-md relative">
							<button
								type="button"
								onClick={() => handleRemoveArrayItem(field.name, index)}
								className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700"
							>
								<Trash className="h-4 w-4" />
							</button>
							<div className="flex flex-col gap-4 mt-4">
								{arrayType.fields.map((subField: any) => (
									<div key={subField.name} className="flex flex-col gap-2">
										<label className="text-sm font-medium text-gray-700">
											{subField.label}
										</label>
										<input
											type={subField.type === 'number' ? 'number' : 'text'}
											value={item[subField.name] || ""}
											onChange={(e) => handleArrayFieldChange(
												field.name,
												index,
												subField.name,
												subField.type === 'number' ? Number(e.target.value) : e.target.value
											)}
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
						<Plus className="h-4 w-4 mr-2" />
						Adicionar {field.label}
					</Button>
				</div>
			</div>
		);
	};

	const renderField = (field: any) => {
		console.log('Rendering field:', field);
		const value = formData[field.name] || "";

		switch (field.type) {
			case "array":
				return renderArrayField(field);

			case "text":
				return (
					<div key={field.name} className="flex flex-col gap-2">
						<label htmlFor={field.name} className="text-sm font-medium text-gray-700">
							{field.label}
						</label>
						<input
							type="text"
							id={field.name}
							value={value}
							onChange={(e) => handleChange(field.name, e.target.value)}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							required={field.required}
						/>
					</div>
				);

			case "textarea":
				return (
					<div key={field.name} className="flex flex-col gap-2">
						<label htmlFor={field.name} className="text-sm font-medium text-gray-700">
							{field.label}
						</label>
						<textarea
							id={field.name}
							value={value}
							onChange={(e) => handleChange(field.name, e.target.value)}
							rows={4}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							required={field.required}
						/>
					</div>
				);

			case "number":
				return (
					<div key={field.name} className="flex flex-col gap-2">
						<label htmlFor={field.name} className="text-sm font-medium text-gray-700">
							{field.label}
						</label>
						<input
							type="number"
							id={field.name}
							value={value}
							onChange={(e) => handleChange(field.name, Number(e.target.value))}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							required={field.required}
						/>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="flex flex-col gap-4">
			{schema.fields.map((field) => renderField(field))}
		</div>
	);
}
