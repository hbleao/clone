"use client";

import {
	DndContext,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";

import s from "./styles.module.scss";

import {
	PageBuilderCanvas,
	PageBuilderSidebar,
	Header,
	Spinner,
} from "@/components";

import { usePageBuilder } from "@/hooks";

import type { PageBuilderProps } from "./types";

export const PageBuilder = ({ page }: PageBuilderProps) => {
	const { setElements } = usePageBuilder();
	const [isReady, setIsReady] = useState(false);
	const mouseSensor = useSensor(MouseSensor, {
		activationConstraint: {
			distance: 10,
		},
	});
	const touchSensor = useSensor(TouchSensor, {
		activationConstraint: {
			delay: 300,
			tolerance: 5,
		},
	});
	const sensors = useSensors(mouseSensor, touchSensor);

	useEffect(() => {
		if (isReady) return;

		try {
			let pageContent = page.content;

			if (typeof pageContent === "string") {
				try {
					pageContent = JSON.parse(pageContent);
				} catch {
					pageContent = [];
				}
			}

			if (!Array.isArray(pageContent)) {
				pageContent = [];
			}

			const elements = pageContent.map((item: any) => {
				let content = item.content;

				if (typeof content === "string") {
					try {
						content = JSON.parse(content);
					} catch {
						content = {};
					}
				}

				return {
					id: item.id,
					type: "SectionField",
					extraAttributes: {
						template: {
							id: item.templateId,
						},
						content: content || {},
					},
				};
			});

			setElements(elements);
		} catch (error) {
			console.error("Erro ao carregar elementos:", error);
			setElements([]);
		}

		setIsReady(true);
	}, [page, setElements, isReady]);

	if (!isReady) {
		return (
			<div className={s.notReady}>
				<Spinner size="md" />
			</div>
		);
	}

	return (
		<DndContext sensors={sensors}>
			<main>
				<Header>
					<div className={s.container}>
						<h2 className={s.title}>
							<span>Página: </span>
							{page.title}
						</h2>
					</div>
				</Header>
				<div className={s.canvas}>
					<div className={s.designerWrapper}>
						<PageBuilderCanvas />
					</div>
					<PageBuilderSidebar />
				</div>
			</main>
		</DndContext>
	);
};
