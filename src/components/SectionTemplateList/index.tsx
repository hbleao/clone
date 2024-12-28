"use client";
import React, { useState, useEffect } from "react";
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

	useEffect(() => {
		async function loadTemplates() {
			try {
				setIsLoading(true);
				setError(null);

				const response = await getAllSectionTemplateService(slug);

				if (response.success && response.data) {
					// Valida e filtra templates
					const validTemplates = response.data.filter(
						(template) =>
							template.id &&
							template.name &&
							template.schema &&
							Array.isArray(template.schema.fields),
					);

					if (validTemplates.length === 0) {
						console.warn("Nenhum template válido encontrado");
						setError("Nenhum template válido encontrado");
						toast.warning("Nenhum template disponível", {
							description: "Crie um novo template para começar",
						});
					}

					setTemplates(validTemplates);
				} else {
					console.error("Erro ao carregar templates:", response.error);
					setError(response.error?.message || "Erro desconhecido");
					toast.error("Erro ao carregar templates", {
						description:
							response.error?.message || "Tente novamente mais tarde",
					});
				}
			} catch (error) {
				console.error("Erro inesperado ao carregar templates:", error);
				setError("Erro inesperado ao carregar templates");
				toast.error("Erro ao carregar templates", {
					description: "Verifique sua conexão e tente novamente",
				});
			} finally {
				setIsLoading(false);
			}
		}

		if (slug) {
			loadTemplates();
		} else {
			console.warn("Slug não fornecido");
			setError("Slug do aplicativo não encontrado");
			toast.warning("Slug não encontrado", {
				description: "Selecione um aplicativo válido",
			});
			setIsLoading(false);
		}
	}, [slug]);

	if (isLoading) {
		return <div>Carregando templates...</div>;
	}

	if (error) {
		return (
			<div className={styles.errorContainer}>
				<p>Erro: {error}</p>
				<Button type="button" onClick={() => window.location.reload()}>
					Tentar Novamente
				</Button>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			{templates.map((template) => (
				<div key={template.id} className={styles.templateItem}>
					<DraggableTemplateItem
						template={template}
						onSelectTemplate={onSelectTemplate}
					/>
				</div>
			))}
		</div>
	);
}
