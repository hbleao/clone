"use client";
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

import styles from "./styles.module.scss";

import {
	DraggableComponentItem,
	type Component,
} from "./DraggableComponentItem";

import { Button } from "@/components";
import { getComponentsBySlugService } from "@/services";

interface SectionComponentListProps {
	slug: string;
	onSelectComponent?: (template: Component) => void;
}

export function SectionComponentList({
	slug,
	onSelectComponent = () => {},
}: SectionComponentListProps) {
	const [components, setComponents] = useState<Component[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Memoiza a função de carregamento para evitar recriações
	const loadComponents = useMemo(
		() => async () => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await getComponentsBySlugService(slug);

				if (response.success && response.data) {
					setComponents(response.data);
				} else {
					const errorMessage =
						response.error?.message || "Erro ao carregar os componentes";
					setError(errorMessage);
					toast.error(errorMessage);
				}
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: "Erro ao carregar os componentes";
				setError(message);
				toast.error(message);
			} finally {
				setIsLoading(false);
			}
		},
		[slug], // Só recria quando o slug mudar
	);

	// Usa useEffect com cleanup para evitar memory leaks
	useEffect(() => {
		let mounted = true;

		const load = async () => {
			await loadComponents();
		};

		if (mounted) {
			load();
		}

		return () => {
			mounted = false;
		};
	}, [loadComponents]); // Depende apenas da função memoizada

	if (isLoading) {
		return <div className={styles.loading}>Carregando componentes...</div>;
	}

	if (error) {
		return (
			<div className={styles.error}>
				<p>{error}</p>
				<Button type="button" onClick={() => loadComponents()}>
					Tentar novamente
				</Button>
			</div>
		);
	}

	if (components.length === 0) {
		return (
			<div className={styles.empty}>
				<p>Nenhum template disponível</p>
				<Button type="button" onClick={() => loadComponents()}>
					Atualizar
				</Button>
			</div>
		);
	}

	return (
		<div className={styles.list}>
			{components.map((component) => (
				<DraggableComponentItem
					key={component.id}
					component={component}
					onSelectComponent={onSelectComponent}
				/>
			))}
		</div>
	);
}
