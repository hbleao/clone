"use client";
import { DndContext } from "@dnd-kit/core";
import { nanoid } from "nanoid";

import { PageBuilderProps } from "./types";
import { PageBuilderContent } from "./content";
import { Header } from "@/components";
import { PageBuilderContextProvider } from "@/context";
import { ElementWrapper } from '@/components/PageBuilderElement/ElementWrapper';
import { ToggleableElement } from '@/interfaces/ToggleComponent';
import s from "./styles.module.scss";

import type { PageBuilderProps } from "./types";

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

				// Se for um item antigo, converte para o novo formato
				return {
					id: item.id || nanoid(),
					type: "section",
					template: item,
					content: {},
				};
			} catch (error) {
				console.error("Error converting item:", error);
				return null;
			}
		})
		.filter(Boolean);

	return (
		<PageBuilderContextProvider initialElements={initialElements}>
			<DndContext>
				<div className={s.pageBuilder}>
					<PageBuilderContent page={page} />
				</div>
			</DndContext>
		</PageBuilderContextProvider>
	);
}
