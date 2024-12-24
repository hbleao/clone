"use client";
import {
	DndContext,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

import s from "./styles.module.scss";

import {
	Button,
	Designer,
	DragOverlayWrapper,
	Header,
	Spinner,
} from "@/components";

import { useDesigner } from "@/hooks";

import type { FormBuilderProps } from "./types";

export const FormBuilder = ({ page }: FormBuilderProps) => {
	const { setElements } = useDesigner();
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (isReady) return;
		const jsonFormContent = JSON.parse(page.content || "[]");
		setElements(jsonFormContent);
		setIsReady(true);
	}, [page, setElements]);

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
							<span>Form: </span>
							{page.title}
						</h2>
						<div className={s.buttons}>
							<Button type="button" variant="disabled">
								<ExternalLink />
								<span>Preview</span>
							</Button>
						</div>
					</div>
				</Header>
				<div className={s.canvas}>
					<Designer />
				</div>
			</main>

			<DragOverlayWrapper />
		</DndContext>
	);
};
