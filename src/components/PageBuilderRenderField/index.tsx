"use client";
import s from "./styles.module.scss";

import type { PageBuilderRenderFieldProps, Field } from "./types";

export const PageBuilderRenderField = ({
	field,
	formData,
	setFormData,
}: PageBuilderRenderFieldProps) => {
	const value = formData[field.name] || "";

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleChange = (newValue: any) => {
		setFormData((prev) => ({
			...prev,
			[field.name]: newValue,
		}));
	};

	switch (field.type) {
		case "text":
			return (
				<div className={s.inputContainer}>
					<input
						type="text"
						id={field.name}
						name={field.name}
						value={value}
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
						value={value}
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
						value={value}
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
						value={value}
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
							value={value}
							onChange={(e) => handleChange(e.target.value)}
							required={field.required}
							placeholder="URL da imagem"
							className={s.input}
						/>
					</div>
				</div>
			);

		case "object":
			if (!field.fields) return null;
			return (
				<div className={s.objectField}>
					{field.fields.map((subField) => (
						<div key={subField.name} className={s.field}>
							<label htmlFor={subField.name}>
								{subField.label}
								{subField.required && <span className={s.required}>*</span>}
							</label>
							{renderField(subField)}
						</div>
					))}
				</div>
			);

		case "array":
			if (!field.arrayType) return null;
			const arrayValue = (value as any[]) || [];
			return (
				<div className={s.arrayField}>
					{arrayValue.map((item, index) => (
						<div key={index} className={s.arrayItem}>
							<div className={s.arrayItemHeader}>
								<h4>Item {index + 1}</h4>
								<button
									type="button"
									onClick={() => {
										const newArray = [...arrayValue];
										newArray.splice(index, 1);
										handleChange(newArray);
									}}
									className={s.removeButton}
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
							{field.arrayType.type === "object" && field.arrayType.fields ? (
								<div className={s.objectField}>
									{field.arrayType.fields.map((subField) => (
										<div key={subField.name} className={s.field}>
											<label
												htmlFor={`${field.name}.${index}.${subField.name}`}
											>
												{subField.label}
												{subField.required && (
													<span className={s.required}>*</span>
												)}
											</label>
											{renderField({
												...subField,
												name: `${field.name}.${index}.${subField.name}`,
											})}
										</div>
									))}
								</div>
							) : (
								renderField({
									...field.arrayType,
									name: `${field.name}.${index}`,
								})
							)}
						</div>
					))}
					<button
						type="button"
						onClick={() => {
							const newArray = [...arrayValue];
							if (field.arrayType?.type === "object") {
								newArray.push({});
							} else {
								newArray.push("");
							}
							handleChange(newArray);
						}}
						className={s.addButton}
					>
						Adicionar Item
					</button>
				</div>
			);

		default:
			return null;
	}
};
