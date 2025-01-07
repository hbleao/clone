"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { GripVertical, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

import { DashboardLayout } from "@/components";
import { Button, Input, Textarea } from "@/components";
import { createSectionTemplateService } from "@/services/createSectionTemplateService";

import s from "./styles.module.scss";

interface Component {
	id: string;
	name: string;
	description: string;
	type: string;
}

export default function NewTemplatePage() {
	const params = useParams();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [form, setForm] = useState({
		name: "",
		description: "",
		components: [] as Component[],
	});

	const handleDragEnd = (result: any) => {
		if (!result.destination) return;

		const items = Array.from(form.components);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setForm({ ...form, components: items });
	};

	const handleAddComponent = () => {
		const newComponent = {
			id: Math.random().toString(36).substr(2, 9),
			name: "Novo Componente",
			description: "Descrição do componente",
			type: "text",
		};

		setForm({
			...form,
			components: [...form.components, newComponent],
		});
	};

	const handleRemoveComponent = (id: string) => {
		setForm({
			...form,
			components: form.components.filter((component) => component.id !== id),
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await createSectionTemplateService(params.slug as string, {
				name: form.name,
				description: form.description,
				components: form.components.map((component, index) => ({
					...component,
					position: index,
				})),
			});

			if (response.success) {
				toast.success("Template criado com sucesso!");
				router.push(`/apps/${params.slug}/templates`);
			} else {
				toast.error(
					typeof response.error === "string"
						? response.error
						: "Erro ao criar template"
				);
			}
		} catch (error) {
			console.error("Error creating template:", error);
			toast.error("Erro ao criar template");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<DashboardLayout slug={params.slug}>
			<div className={s.container}>
				<div className={s.pageHeader}>
					<h1>Novo Template</h1>
					<p>Crie um novo template para suas páginas</p>
				</div>

				<form onSubmit={handleSubmit} className={s.form}>
					<div className={s.formGroup}>
						<label htmlFor="name">Nome do Template</label>
						<Input
							id="name"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							placeholder="Digite o nome do template"
							required
						/>
						<p>Este nome será usado para identificar o template</p>
					</div>

					<div className={s.formGroup}>
						<label htmlFor="description">Descrição</label>
						<Textarea
							id="description"
							value={form.description}
							onChange={(e) =>
								setForm({ ...form, description: e.target.value })
							}
							placeholder="Digite uma descrição para o template"
							required
						/>
						<p>Uma breve descrição do propósito deste template</p>
					</div>

					<div className={s.components}>
						<div className={s.componentsHeader}>
							<div>
								<h2>Componentes</h2>
								<p>Adicione e organize os componentes do template</p>
							</div>
							<Button type="button" onClick={handleAddComponent} size="sm">
								<Plus size={16} />
								Adicionar Componente
							</Button>
						</div>

						<DragDropContext onDragEnd={handleDragEnd}>
							<Droppable droppableId="components">
								{(provided) => (
									<div
										ref={provided.innerRef}
										{...provided.droppableProps}
										className={`${s.componentList} ${
											form.components.length === 0 ? s.isEmpty : ""
										}`}
									>
										{form.components.length === 0 ? (
											<div>
												<p>Nenhum componente adicionado</p>
												<Button
													type="button"
													onClick={handleAddComponent}
													variant="outline"
												>
													<Plus size={16} />
													Adicionar Componente
												</Button>
											</div>
										) : (
											form.components.map((component, index) => (
												<Draggable
													key={component.id}
													draggableId={component.id}
													index={index}
												>
													{(provided) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															className={s.component}
														>
															<div
																{...provided.dragHandleProps}
																className={s.dragHandle}
															>
																<GripVertical size={20} />
															</div>

															<div className={s.componentInfo}>
																<h3>{component.name}</h3>
																<p>{component.description}</p>
															</div>

															<div className={s.componentActions}>
																<Button
																	type="button"
																	variant="ghost"
																	size="sm"
																	onClick={() =>
																		handleRemoveComponent(component.id)
																	}
																>
																	<Trash size={16} />
																</Button>
															</div>
														</div>
													)}
												</Draggable>
											))
										)}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext>
					</div>

					<div className={s.formActions}>
						<Button
							type="button"
							variant="outline"
							onClick={() => router.push(`/apps/${params.slug}/templates`)}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Criando..." : "Criar Template"}
						</Button>
					</div>
				</form>
			</div>
		</DashboardLayout>
	);
}
