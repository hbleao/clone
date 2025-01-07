"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash, Copy } from "lucide-react";
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
				<Link
					href={`/apps/${params.slug}/componentes/novo`}
					width="contain"
					size="lg"
				>
					<Plus size={16} />
					Novo componente
				</Link>
			</div>

			{isLoading ? (
				<div className={s.loading}>
					<div className={s.loading__spinner} />
				</div>
			) : components.length === 0 ? (
				<div className={s.empty}>
					<p>Nenhum componente encontrado</p>
					<Link href={`/apps/${params.slug}/componentes/novo`}>
						<Plus size={16} />
						Criar primeiro componente
					</Link>
				</div>
			) : (
				<div className={s.grid}>
					{components.map((component) => (
						<div
							key={component.id}
							className={s.card}
							onClick={() => handleEdit(component)}
							onKeyDown={() => handleEdit(component)}
						>
							<div className={s.card__header}>
								<div className={s.card__title}>
									<h3>{component.name}</h3>
									<span className={s.card__type}>{component.type}</span>
								</div>
								<div className={s.card__actions}>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={(e) => {
											e.stopPropagation();
											handleDuplicate(component);
										}}
										title="Duplicar componente"
									>
										<Copy size={16} />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={(e) => {
											e.stopPropagation();
											handleDelete(component);
										}}
										title="Excluir componente"
									>
										<Trash size={16} />
									</Button>
								</div>
							</div>

							<p className={s.card__description}>{component.description}</p>

							<div className={s.card__footer}>
								<span>
									Criado em: {formatDate(String(component.createdAt))}
								</span>
								<span>
									Atualizado em: {formatDate(String(component.updatedAt))}
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</DashboardLayout>
	);
}
