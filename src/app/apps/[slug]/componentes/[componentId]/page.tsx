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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			if (!formData.name) {
				toast.error("O nome do componente é obrigatório");
				return;
			}

			let result;
			if (isEditing) {
				result = await updateComponentService(
					params.slug as string,
					params.componentId as string,
					formData,
				);
			} else {
				result = await createComponentService(params.slug as string, formData);
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
				if (!newFields[parentIndex].arrayType) {
					newFields[parentIndex].arrayType = {
						type: "object",
						fields: [],
					};
				}
				if (!newFields[parentIndex].arrayType.fields) {
					newFields[parentIndex].arrayType.fields = [];
				}
				newFields[parentIndex].arrayType.fields = [
					...newFields[parentIndex].arrayType.fields!,
					newField,
				];
			} else if (newFields[parentIndex].type === "object") {
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
				schema: {
					...prev.schema,
					fields: newFields,
				},
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				schema: {
					...prev.schema,
					fields: [...prev.schema.fields, newField],
				},
			}));
		}
	};

	const updateField = (
		index: number,
		field: Partial<Field>,
		parentIndex?: number,
		isArrayField?: boolean,
	) => {
		const newFields = [...formData.schema.fields];

		if (parentIndex !== undefined) {
			if (isArrayField && newFields[parentIndex].type === "array") {
				if (newFields[parentIndex].arrayType?.fields) {
					newFields[parentIndex].arrayType.fields[index] = {
						...newFields[parentIndex].arrayType.fields[index],
						...field,
					};
				}
			} else if (newFields[parentIndex].type === "object") {
				if (newFields[parentIndex].fields) {
					newFields[parentIndex].fields[index] = {
						...newFields[parentIndex].fields[index],
						...field,
					};
				}
			}
		} else {
			newFields[index] = {
				...newFields[index],
				...field,
			};
		}

		setFormData((prev) => ({
			...prev,
			schema: {
				...prev.schema,
				fields: newFields,
			},
		}));
	};

	const removeField = (
		index: number,
		parentIndex?: number,
		isArrayField?: boolean,
	) => {
		const newFields = [...formData.schema.fields];

		if (parentIndex !== undefined) {
			if (isArrayField && newFields[parentIndex].type === "array") {
				if (newFields[parentIndex].arrayType?.fields) {
					newFields[parentIndex].arrayType.fields = newFields[
						parentIndex
					].arrayType.fields!.filter((_, i) => i !== index);
				}
			} else if (newFields[parentIndex].type === "object") {
				if (newFields[parentIndex].fields) {
					newFields[parentIndex].fields = newFields[parentIndex].fields!.filter(
						(_, i) => i !== index,
					);
				}
			}
		} else {
			newFields.splice(index, 1);
		}

		setFormData((prev) => ({
			...prev,
			schema: {
				...prev.schema,
				fields: newFields,
			},
		}));
	};

	return (
		<DashboardLayout slug={params.slug}>
			<div className={s.container}>
				<h1>{isEditing ? "Editar Componente" : "Novo Componente"}</h1>

				<form onSubmit={handleSubmit} className={s.form}>
					<div className={s.field}>
						<Input
							label="Nome do Componente"
							value={formData.name}
							onChange={(value) =>
								setFormData((prev) => ({ ...prev, name: value }))
							}
							required
						/>
					</div>

					<div className={s.field}>
						<Textarea
							label="Descrição"
							value={formData.description}
							onChange={(value) =>
								setFormData((prev) => ({
									...prev,
									description: value,
								}))
							}
						/>
					</div>

					<div className={s.field}>
						<h3>Campos</h3>
						<div className={s.fields}>
							{formData.schema.fields.map((field, index) => (
								<div key={index} className={s.fieldGroup}>
									<Input
										label="Nome do Campo"
										value={field.name}
										onChange={(value) => updateField(index, { name: value })}
										required
									/>
									<Input
										label="Label"
										value={field.label}
										onChange={(value) => updateField(index, { label: value })}
										required
									/>
									<select
										value={field.type}
										onChange={(e) =>
											updateField(index, {
												type: e.target.value,
											})
										}
									>
										<option value="text">Texto</option>
										<option value="number">Número</option>
										<option value="boolean">Booleano</option>
										<option value="date">Data</option>
										<option value="array">Array</option>
										<option value="object">Objeto</option>
									</select>
									<label>
										<input
											type="checkbox"
											checked={field.required}
											onChange={(e) =>
												updateField(index, {
													required: e.target.checked,
												})
											}
										/>
										Obrigatório
									</label>
									<button type="button" onClick={() => removeField(index)}>
										Remover
									</button>

									{field.type === "array" && (
										<div className={s.arrayFields}>
											<h4>Campos do Array</h4>
											{field.arrayType?.fields?.map(
												(arrayField, arrayIndex) => (
													<div key={arrayIndex} className={s.fieldGroup}>
														<Input
															label="Nome do Campo"
															value={arrayField.name}
															onChange={(value) =>
																updateField(
																	arrayIndex,
																	{
																		name: value,
																	},
																	index,
																	true,
																)
															}
															required
														/>
														<Input
															label="Label"
															value={arrayField.label}
															onChange={(value) =>
																updateField(
																	arrayIndex,
																	{
																		label: value,
																	},
																	index,
																	true,
																)
															}
															required
														/>
														<select
															value={arrayField.type}
															onChange={(e) =>
																updateField(
																	arrayIndex,
																	{
																		type: e.target.value,
																	},
																	index,
																	true,
																)
															}
														>
															<option value="text">Texto</option>
															<option value="number">Número</option>
															<option value="boolean">Booleano</option>
															<option value="date">Data</option>
															<option value="object">Objeto</option>
														</select>
														<label>
															<input
																type="checkbox"
																checked={arrayField.required}
																onChange={(e) =>
																	updateField(
																		arrayIndex,
																		{
																			required: e.target.checked,
																		},
																		index,
																		true,
																	)
																}
															/>
															Obrigatório
														</label>
														<button
															type="button"
															onClick={() =>
																removeField(arrayIndex, index, true)
															}
														>
															Remover
														</button>
													</div>
												),
											)}
											<button
												type="button"
												onClick={() => addField([], index, true)}
											>
												Adicionar Campo
											</button>
										</div>
									)}

									{field.type === "object" && (
										<div className={s.objectFields}>
											<h4>Campos do Objeto</h4>
											{field.fields?.map((objectField, objectIndex) => (
												<div key={objectIndex} className={s.fieldGroup}>
													<Input
														label="Nome do Campo"
														value={objectField.name}
														onChange={(value) =>
															updateField(
																objectIndex,
																{
																	name: value,
																},
																index,
															)
														}
														required
													/>
													<Input
														label="Label"
														value={objectField.label}
														onChange={(value) =>
															updateField(
																objectIndex,
																{
																	label: value,
																},
																index,
															)
														}
														required
													/>
													<select
														value={objectField.type}
														onChange={(e) =>
															updateField(
																objectIndex,
																{
																	type: e.target.value,
																},
																index,
															)
														}
													>
														<option value="text">Texto</option>
														<option value="number">Número</option>
														<option value="boolean">Booleano</option>
														<option value="date">Data</option>
													</select>
													<label>
														<input
															type="checkbox"
															checked={objectField.required}
															onChange={(e) =>
																updateField(
																	objectIndex,
																	{
																		required: e.target.checked,
																	},
																	index,
																)
															}
														/>
														Obrigatório
													</label>
													<button
														type="button"
														onClick={() => removeField(objectIndex, index)}
													>
														Remover
													</button>
												</div>
											))}
											<button type="button" onClick={() => addField([], index)}>
												Adicionar Campo
											</button>
										</div>
									)}
								</div>
							))}
							<button
								type="button"
								onClick={() => addField(formData.schema.fields)}
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
