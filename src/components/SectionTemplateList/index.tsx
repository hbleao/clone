"use client";
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

import styles from "./styles.module.scss";
import { DraggableTemplateItem } from "./DraggableTemplateItem";

import { Button } from "@/components";
import { getAllSectionTemplateService } from "@/services";

import type { SectionTemplate } from "@/types/section";

interface SectionTemplateListProps {
	slug: string;
	onSelectTemplate?: (template: SectionTemplate) => void;
}

export function SectionTemplateList({
	slug,
	onSelectTemplate = () => {},
}: SectionTemplateListProps) {
	const [templates, setTemplates] = useState<SectionTemplate[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Memoiza a função de carregamento para evitar recriações
	const loadTemplates = useMemo(
		() => async () => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await getAllSectionTemplateService(slug);

				if (response.success && response.data) {
					setTemplates(response.data);
				} else {
					const errorMessage = response.error?.message || "Erro ao carregar templates";
					setError(errorMessage);
					toast.error(errorMessage);
				}
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Erro ao carregar templates";
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
			await loadTemplates();
		};

		if (mounted) {
			load();
		}

		return () => {
			mounted = false;
		};
	}, [loadTemplates]); // Depende apenas da função memoizada

	if (isLoading) {
		return <div className={styles.loading}>Carregando templates...</div>;
	}

	if (error) {
		return (
			<div className={styles.error}>
				<p>{error}</p>
				<Button type="button" onClick={() => loadTemplates()}>
					Tentar novamente
				</Button>
			</div>
		);
	}

	if (templates.length === 0) {
		return (
			<div className={styles.empty}>
				<p>Nenhum template disponível</p>
				<Button type="button" onClick={() => loadTemplates()}>
					Atualizar
				</Button>
			</div>
		);
	}

	return (
		<div className={styles.list}>
			{templates.map((template) => (
				<DraggableTemplateItem
					key={template.id}
					template={template}
					onSelectTemplate={onSelectTemplate}
				/>
			))}
		</div>
	);
}
