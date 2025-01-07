"use client";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import { nanoid } from "nanoid";

import s from "./styles.module.scss";

import { Button, SectionComponentList } from "@/components";
import { usePageBuilder } from "@/hooks";

import type { Component } from "@/components/SectionComponentList/DraggableComponentItem";

export const PageBuilderSidebar = () => {
	const params = useParams();
	const router = useRouter();
	const slug = params.slug as string;
	const { elements, addElement } = usePageBuilder();

	const handleAddSection = (component: Component) => {
		// Cria uma cópia limpa do template
		const cleanComponent = {
			id: component.id,
			name: component.name,
			type: component.type,
			schema: component.schema,
		};

		const element = {
			id: nanoid(),
			type: "section",
			template: cleanComponent,
			content: component.defaultData || {},
		};

		console.log("COMPONENT SELECIONADO", elements);

		addElement(elements?.length || 0, element);
		toast.success("Seção adicionada com sucesso");
	};

	return (
		<div className={s.pageBuilderSidebar}>
			<div className={s.header}>
				<Button
					type="button"
					variant="disabled"
					width="contain"
					onClick={() => router.back()}
				>
					<ChevronLeft />
					Voltar
				</Button>
			</div>

			<div className={s.content}>
				<h2>Seções</h2>

				<SectionComponentList
					slug={slug}
					onSelectComponent={handleAddSection}
				/>
			</div>
		</div>
	);
};
