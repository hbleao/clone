"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash, Copy, Edit2 } from "lucide-react";
import { toast } from "sonner";

import s from "./styles.module.scss";

import { DashboardLayout, Button, Link } from "@/components";
import { deleteComponent, duplicateComponent } from "@/actions/component";
import { getComponentsBySlugService } from "@/services";

interface Component {
	id: string;
	name: string;
	type: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
}

export default function ComponentsPage() {
	const params = useParams();
	const router = useRouter();
	const [components, setComponents] = useState<Component[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const formatDate = (dateString: string) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	};

	const loadComponents = async () => {
		try {
			const result = await getComponentsBySlugService(params.slug as string);
			if (result.success && result.data) {
				setComponents(result.data);
			} else {
				toast.error(result.error?.message || "Erro ao carregar componentes");
			}
		} catch (error) {
			console.error("Erro ao carregar componentes:", error);
			toast.error("Erro ao carregar componentes");
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (component: Component) => {
		router.push(`/apps/${params.slug}/componentes/${component.id}`);
	};

	const handleDuplicate = async (component: Component) => {
		try {
			const result = await duplicateComponent(component.id);
			if (result.success) {
				toast.success("Componente duplicado com sucesso!");
				loadComponents();
			} else {
				toast.error(result.error as string);
			}
		} catch (error) {
			console.error("Erro ao duplicar componente:", error);
			toast.error("Erro ao duplicar componente");
		}
	};

	const handleDelete = async (component: Component) => {
		if (!confirm("Tem certeza que deseja excluir este componente?")) {
			return;
		}

		try {
			const result = await deleteComponent(component.id);
			if (result.success) {
				toast.success("Componente excluído com sucesso!");
				loadComponents();
			} else {
				toast.error(result.error as string);
			}
		} catch (error) {
			console.error("Erro ao excluir componente:", error);
			toast.error("Erro ao excluir componente");
		}
	};

	useEffect(() => {
		loadComponents();
	}, [params.slug]);

	return (
		<DashboardLayout slug={params.slug}>
			<div className={s.header}>
				<div className={s.header__title}>
					<h1>Gerencie os componentes do seu aplicativo</h1>
				</div>
				<Button
					type="button"
					width="contain"
					size="lg"
					onClick={() => router.push(`/apps/${params.slug}/componentes/novo`)}
				>
					<Plus size={20} />
					Novo Componente
				</Button>
			</div>

			{isLoading ? (
				<div className={s.components__loading}>
					<div className={s.components__loading_spinner} />
				</div>
			) : components.length === 0 ? (
				<div className={s.components__empty}>
					<p className={s.components__empty_message}>
						Você ainda não possui componentes criados
					</p>
					<Button
						type="button"
						width="contain"
						size="lg"
						onClick={() => router.push(`/apps/${params.slug}/componentes/novo`)}
					>
						<Plus size={20} />
						Criar Primeiro Componente
					</Button>
				</div>
			) : (
				<div className={s.components__grid}>
					{components.map((component) => (
						<div key={component.id} className={s.component_card}>
							<div className={s.component_card__header}>
								<div className={s.component_card__title}>
									<h1>{component.name}</h1>
									<p>{component.description || "Sem descrição"}</p>
								</div>
								<span
									className={`${s.component_card__type} ${s[component.type.toLocaleLowerCase()]}`}
								>
									{component.type}
								</span>
							</div>

							<div className={s.component_card__details}>
								<div className={s.component_card__details_item}>
									<div className={s.component_card__details_item_label}>
										Criado em
									</div>
									<div className={s.component_card__details_item_value}>
										{formatDate(component.createdAt)}
									</div>
								</div>
								<div className={s.component_card__details_item}>
									<div className={s.component_card__details_item_label}>
										Última Atualização
									</div>
									<div className={s.component_card__details_item_value}>
										{formatDate(component.updatedAt || component.createdAt)}
									</div>
								</div>
							</div>

							<div className={s.component_card__actions}>
								<div className={s.component_card__actions_buttons}>
									<button
										type="button"
										className={s.component_card__actions_btn}
										onClick={() => handleEdit(component)}
										title="Editar"
									>
										<Edit2 size={16} />
									</button>
									<button
										type="button"
										className={s.component_card__actions_btn}
										onClick={() => handleDuplicate(component)}
										title="Duplicar"
									>
										<Copy size={16} />
									</button>
									<button
										type="button"
										className={s.component_card__actions_btn}
										onClick={() => handleDelete(component)}
										title="Excluir"
									>
										<Trash size={16} />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</DashboardLayout>
	);
}
