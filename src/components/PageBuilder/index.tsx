"use client";
import { DndContext } from "@dnd-kit/core";
import { nanoid } from "nanoid";

import s from "./styles.module.scss";

import { Header, PageBuilderCanvas, PageBuilderSidebar } from "@/components";
import { PageBuilderContextProvider } from "@/context";

import type { PageBuilderProps } from "./types";

export function PageBuilder({ page }: PageBuilderProps) {
	// Tenta fazer o parse do conteúdo se for string
	let parsedContent;
	try {
		parsedContent =
			typeof page.content === "string"
				? JSON.parse(page.content)
				: page.content;
	} catch (error) {
		console.error("Error parsing page content:", error);
		parsedContent = [];
	}

	// Converte o conteúdo da página para elementos do PageBuilder
	const initialElements = (parsedContent || [])
		.map((item: any) => {
			try {
				// Se o item já estiver no formato correto
				if (item.type === "section") {
					// Valida campos obrigatórios
					if (!item.id || !item.template?.id) {
						console.warn("Item inválido:", item);
						return null;
					}
					return item;
				}

				// Se o item estiver no formato SectionField
				if (item.type === "SectionField") {
					// Valida campos obrigatórios
					if (!item.id || !item.extraAttributes?.templateId) {
						console.warn("Item inválido:", item);
						return null;
					}

					return {
						id: item.id || nanoid(),
						type: "section",
						template: {
							id: item.extraAttributes?.templateId,
							name: item.extraAttributes?.name,
							type: item.extraAttributes?.type,
							schema: item.extraAttributes?.schema,
						},
						content: item.extraAttributes?.content || {},
					};
				}

				// Formato desconhecido
				console.warn("Formato desconhecido:", item);
				return null;
			} catch (error) {
				console.error("Erro ao processar item:", error);
				return null;
			}
		})
		.filter(Boolean);

	return (
		<PageBuilderContextProvider initialElements={initialElements}>
			<DndContext>
				<Header />
				<div className={s.pageBuilder}>
					<PageBuilderSidebar />
					<div className={s.containerCanvas}>
						<h1 className={s.title}>Construtor de páginas</h1>
						<PageBuilderCanvas />
					</div>
				</div>
			</DndContext>
		</PageBuilderContextProvider>
	);
}
