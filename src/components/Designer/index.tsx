"use client";

import { type DragEndEvent, useDndMonitor, useDroppable } from "@dnd-kit/core";
import { nanoid } from "nanoid";

import { useDesigner } from "@/hooks";
import { FormElements } from "../FormElements";
import type { ElementsType, FormElementInstance } from "../FormElements";
import { DesignerElementWrapper } from "./DesignerElementWrapper";

import s from "./styles.module.scss";

export const Designer = () => {
	const { elements, addElement, removeElement } = useDesigner();
	const droppable = useDroppable({
		id: "designer-drop-area",
		data: {
			isDesignerDropArea: true,
		},
	});

	useDndMonitor({
		onDragEnd: (event: DragEndEvent) => {
			const { active, over } = event;
			if (!active || !over) return;

			const isDesignerBtnElement = active?.data?.current?.isDesignerBtnElement;
			const isDroppingOverDesignerDropArea =
				over?.data?.current?.isDesignerDropArea;

			// First scenario: dropping a sidebar btn element over the designer drop area
			if (isDesignerBtnElement && isDroppingOverDesignerDropArea) {
				const type = active?.data?.current?.type as ElementsType;
				const template = active?.data?.current?.template;

				console.log('Dropping element with type:', type);
				console.log('Template:', template);
				console.log('FormElements:', FormElements);

				if (!type || !FormElements[type]) {
					console.error('Invalid element type:', type);
					return;
				}

				if (type === "SectionField" && template) {
					const element = FormElements[type].construct(nanoid());
					element.extraAttributes = {
						template,
						content: "",
					};
					console.log('Created section element:', element);
					addElement(elements.length, element);
					return;
				}

				const newElement = FormElements[type].construct(nanoid());
				addElement(elements.length, newElement);
				return;
			}

			// Second scenario: dropping a sidebar btn element over a designer element
			const isDroppingOverDesignerElement =
				over?.data?.current?.isTopHalfDesignerElement ||
				over?.data?.current?.isBottomHalfDesignerElement;

			if (isDesignerBtnElement && isDroppingOverDesignerElement) {
				const type = active?.data?.current?.type as ElementsType;
				const template = active?.data?.current?.template;
				const overId = over?.data?.current?.elementId;

				if (!type || !FormElements[type]) {
					console.error('Invalid element type:', type);
					return;
				}

				const overElementIndex = elements.findIndex((el) => el.id === overId);
				if (overElementIndex === -1) return;

				let indexForNewElement = overElementIndex;
				if (over?.data?.current?.isBottomHalfDesignerElement) {
					indexForNewElement = overElementIndex + 1;
				}

				if (type === "SectionField" && template) {
					const element = FormElements[type].construct(nanoid());
					element.extraAttributes = {
						template,
						content: "",
					};
					addElement(indexForNewElement, element);
					return;
				}

				const newElement = FormElements[type].construct(nanoid());
				addElement(indexForNewElement, newElement);
				return;
			}

			// Third scenario: dropping a designer element over another designer element
			const isDraggingDesignerElement = active?.data?.current?.isDesignerElement;

			if (isDraggingDesignerElement && isDroppingOverDesignerElement) {
				const activeId = active.data?.current?.elementId;
				const overId = over.data?.current?.elementId;

				const activeElementIndex = elements.findIndex((el) => el.id === activeId);
				const overElementIndex = elements.findIndex((el) => el.id === overId);

				if (activeElementIndex === -1 || overElementIndex === -1) return;

				const activeElement = { ...elements[activeElementIndex] };
				removeElement(activeId);

				let indexForNewElement = overElementIndex;
				if (over?.data?.current?.isBottomHalfDesignerElement) {
					indexForNewElement = overElementIndex + 1;
				}

				addElement(indexForNewElement, activeElement);
			}
		},
	});

	return (
		<div className={s.designerWrapper}>
			<div ref={droppable.setNodeRef} className={s.designer}>
				<div className={s.elementsWrapper}>
					{!elements.length && (
						<div className={s.placeholder}>
							<p>Arraste e solte elementos aqui</p>
						</div>
					)}
					{elements.map((element) => {
						const type = element.type as ElementsType || "SectionField";
						console.log('Rendering element:', {
							id: element.id,
							type,
							extraAttributes: element.extraAttributes,
							isTypeValid: FormElements[type],
							availableTypes: Object.keys(FormElements),
						});
						
						if (!FormElements[type]) {
							console.error('Invalid element type:', { element, type });
							return null;
						}

						const formElement = FormElements[type];
						const DesignerElement = formElement.designerComponent;
						
						if (!DesignerElement) {
							console.error('Designer component not found for type:', type);
							return null;
						}

						return (
							<div key={element.id} className={s.elementContainer}>
								<DesignerElementWrapper
									element={{
										...element,
										type,
									}}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
