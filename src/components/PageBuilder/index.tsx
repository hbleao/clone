"use client";
import { DndContext } from "@dnd-kit/core";
import { nanoid } from "nanoid";

import { Header } from "@/components";
import { PageBuilderContextProvider } from "@/context";

import type { PageBuilderProps } from "./types";
import { PageBuilderContent } from "./content";

export function PageBuilder({ page }: PageBuilderProps) {
	// Tenta fazer o parse do conteúdo se for string
	// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
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
	const initialElements = ((parsedContent?.sections || []))
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
				<PageBuilderContent page={page} />
			</DndContext>
		</PageBuilderContextProvider>
	);
}
