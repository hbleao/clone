"use client";

import {
	type DragEndEvent,
	useDndMonitor,
	useDroppable,
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { nanoid } from "nanoid";

import { usePageBuilder } from "@/hooks";
import { PageBuilderElement } from "@/components";

import s from "./styles.module.scss";

export const PageBuilderCanvas = () => {
	const { elements, addElement, removeElement, setElements } = usePageBuilder();
	const droppable = useDroppable({
		id: "designer-drop-area",
		data: {
			isDesignerDropArea: true,
		},
	});

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		console.log("DragEnd:", { active, over });

		if (!active || !over) return;

		// Se estamos arrastando um elemento do sidebar
		const isDesignerBtnElement = active?.data?.current?.isDesignerBtnElement;
		const isDroppingOverDesignerDropArea = over?.data?.current?.isDesignerDropArea;

		if (isDesignerBtnElement && isDroppingOverDesignerDropArea) {
			const template = active?.data?.current?.template;
			console.log("Template:", template);

			if (!template) {
				console.error("Template not found");
				return;
			}

			const element = {
				id: nanoid(),
				type: "section",
				template,
				content: template.defaultData || {},
			};

			console.log("Adding element:", element);
			addElement(elements.length, element);
			return;
		}

		// Se estamos reordenando elementos existentes
		if (active.id !== over.id) {
			console.log("Reordering elements:", { active, over });
			const oldIndex = elements.findIndex((item) => item.id === active.id);
			const newIndex = elements.findIndex((item) => item.id === over.id);

			if (oldIndex !== -1 && newIndex !== -1) {
				const newElements = [...elements];
				const [movedItem] = newElements.splice(oldIndex, 1);
				newElements.splice(newIndex, 0, movedItem);
				console.log("New elements order:", newElements);
				setElements(newElements);
			}
		}
	};

	return (
		<div ref={droppable.setNodeRef} className={s.canvas}>
			{!elements.length && (
				<div className={s.placeholder}>
					<p>Arraste e solte elementos aqui</p>
				</div>
			)}
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={elements.map((e) => e.id)}
					strategy={verticalListSortingStrategy}
				>
					{elements.map((element) => (
						<PageBuilderElement
							key={element.id}
							element={element}
							onEdit={() => {
								// Implementar atualização do elemento
							}}
							onRemove={() => removeElement(element.id)}
						/>
					))}
				</SortableContext>
			</DndContext>
		</div>
	);
};
