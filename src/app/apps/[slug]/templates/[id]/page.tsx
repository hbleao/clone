"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { GripVertical, Plus, Trash } from "lucide-react";

import { DashboardLayout } from "@/components";
import { Button, Input, Textarea } from "@/components";
import { api } from "@/lib/api";

import styles from "./styles.module.scss";

interface Component {
	id: string;
	name: string;
	type: string;
	description: string | null;
}

interface Template {
	id: string;
	name: string;
	description: string;
	components: Array<{
		id: string;
		componentId: string;
		position: number;
		initialData: string | null;
		component: Component;
	}>;
}

export default function EditTemplatePage() {
	const params = useParams();
	const router = useRouter();
	const [template, setTemplate] = useState<Template | null>(null);
	const [components, setComponents] = useState<Component[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [form, setForm] = useState({
		name: "",
		description: "",
		components: [],
	});

	useEffect(() => {
		async function loadTemplate() {
			try {
				const response = await api.get(
					`/api/apps/${params.slug}/templates/${params.id}`,
				);
				const template = response.data;
				setTemplate(template);
				setForm({
					name: template.name,
					description: template.description,
					components: template.components.map((component) => ({
						id: component.id,
						componentId: component.componentId,
						position: component.position,
						initialData: component.initialData
							? JSON.parse(component.initialData)
							: {},
					})),
				});
			} catch (error) {
				console.error(error);
			}
		}

		async function loadComponents() {
			try {
				const response = await api.get(`/api/apps/${params.slug}/components`);
				setComponents(response.data);
			} catch (error) {
				console.error(error);
			}
		}

		loadTemplate();
		loadComponents();
	}, [params.slug, params.id]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);

		try {
			await api.put(`/api/apps/${params.slug}/templates/${params.id}`, form);
			router.push(`/apps/${params.slug}/templates`);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}

	function onDragEnd(result: any) {
		if (!result.destination) return;

		const items = Array.from(form.components);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		// Update positions
		const updatedItems = items.map((item, index) => ({
			...item,
			position: index,
		}));

		setForm({ ...form, components: updatedItems });
	}

	return (
		<DashboardLayout slug={params.slug}>
			<div className={styles.container}>
				<div className={styles.header}>
					<div className={styles.title}>
						<h1>Editar Template</h1>
						<p>Edite as informações do template</p>
					</div>

					<Button
						type="button"
						variant="danger"
						onClick={async () => {
							if (!confirm("Tem certeza que deseja excluir este template?"))
								return;

							await api.delete(
								`/api/apps/${params.slug}/templates/${params.id}`,
							);
							router.push(`/apps/${params.slug}/templates`);
						}}
					>
						<Trash className="mr-2 h-4 w-4" />
						Excluir Template
					</Button>
				</div>

				<form onSubmit={onSubmit} className={styles.form}>
					<div className={styles.grid}>
						<div>
							<label>Nome</label>
							<Input
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
							/>
							<p>Nome do template</p>
						</div>

						<div>
							<label>Descrição</label>
							<Textarea
								value={form.description}
								onChange={(e) =>
									setForm({ ...form, description: e.target.value })
								}
							/>
							<p>Descrição do template</p>
						</div>
					</div>

					<div className={styles.components}>
						<div className={styles.componentsHeader}>
							<div className={styles.componentsTitle}>
								<h2>Componentes</h2>
								<p>Adicione e organize os componentes do template</p>
							</div>

							<Button
								type="button"
								onClick={() => {
									setForm({
										...form,
										components: [
											...form.components,
											{
												componentId: components?.[0]?.id || "",
												position: form.components.length,
												initialData: {},
											},
										],
									});
								}}
							>
								<Plus className="mr-2 h-4 w-4" />
								Adicionar Componente
							</Button>
						</div>

						<DragDropContext onDragEnd={onDragEnd}>
							<Droppable droppableId="components">
								{(provided) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className={styles.componentsList}
									>
										{form.components.map((component, index) => (
											<Draggable
												key={index}
												draggableId={index.toString()}
												index={index}
											>
												{(provided) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														className={styles.componentItem}
													>
														<div
															{...provided.dragHandleProps}
															className={styles.grip}
														>
															<GripVertical className="h-5 w-5" />
														</div>

														<select
															className={styles.select}
															value={component.componentId}
															onChange={(e) => {
																const components = [...form.components];
																components[index] = {
																	...components[index],
																	componentId: e.target.value,
																};
																setForm({ ...form, components });
															}}
														>
															{components?.map((component) => (
																<option key={component.id} value={component.id}>
																	{component.name}
																</option>
															))}
														</select>

														<Button
															type="button"
															variant="ghost"
															onClick={() => {
																const components = [...form.components];
																components.splice(index, 1);
																setForm({
																	...form,
																	components: components.map((item, i) => ({
																		...item,
																		position: i,
																	})),
																});
															}}
														>
															<Trash className="h-4 w-4" />
														</Button>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext>
					</div>

					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Salvando..." : "Salvar Alterações"}
					</Button>
				</form>
			</div>
		</DashboardLayout>
	);
}
