'use client';
import { type DragEndEvent, useDndMonitor, useDroppable } from '@dnd-kit/core';

import s from './styles.module.scss';

import { useDesigner } from '@/hooks';

import { DesignerSidebar } from '../DesignerSidebar';
import { type ElementsType, FormElements } from '../FormElements';
import { DesignerElementWrapper } from './DesignerElementWrapper';

import { idGenerator } from '@/helper';

export const Designer = () => {
	const { elements, addElement, removeElement } = useDesigner();
	const droppable = useDroppable({
		id: 'designer-drop-area',
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
			const isDroppingSidebarBtnOverDesignerDropArea =
				isDesignerBtnElement && isDroppingOverDesignerDropArea;

			// First scenario: dropping a sidebar btn element over the designer drop area
			if (isDroppingSidebarBtnOverDesignerDropArea) {
				setElementInTheLastIndex(active);
				return;
			}

			const isDroppingOverDesignerElementTopHalf =
				over?.data?.current?.isTopHalfDesignerElement;
			const isDroppingOverDesignerElementBottomHalf =
				over?.data?.current?.isBottomHalfDesignerElement;

			const isDroppingOverDesignerElement =
				isDroppingOverDesignerElementTopHalf ||
				isDroppingOverDesignerElementBottomHalf;

			const droppingSidebarBtnOverDesignerElement =
				isDesignerBtnElement && isDroppingOverDesignerElement;

			// Second scenario: dropping a sidebar btn element over the dropping element
			if (droppingSidebarBtnOverDesignerElement) {
				setElementOverDesigner(active, over);
				return;
			}

			const isDraggingDesignerElement =
				active?.data?.current?.isDesignerElement;
			const isDraggingDesignerElementOverAnotherDesignerElement =
				isDroppingOverDesignerElement && isDraggingDesignerElement;

			// Third scenario: dropping a element over another dropping element
			if (isDraggingDesignerElementOverAnotherDesignerElement) {
				setElementAboveAnotherElement(active, over);
				return;
			}
		},
	});
	const droppableIsOverClass = droppable.isOver ? s.activeBox : '';

	function setElementInTheLastIndex(active: any) {
		const type = active?.data?.current?.type as ElementsType;
		const newElement = FormElements[type].construct(idGenerator());
		addElement(elements.length, newElement);
		return;
	}

	function setElementOverDesigner(active: any, over: any) {
		const type = active?.data?.current?.type as ElementsType;
		const newElement = FormElements[type].construct(idGenerator());
		const overId = over?.data?.current?.elementId;
		const isDroppingOverDesignerElementBottomHalf =
			over?.data?.current?.isBottomHalfDesignerElement;

		const overElementIndex = elements.findIndex(
			(element) => element.id === overId,
		);

		if (overElementIndex === -1) {
			throw new Error('Element not found.');
		}

		let indexForNewElement = overElementIndex;

		if (isDroppingOverDesignerElementBottomHalf) {
			indexForNewElement = overElementIndex + 1;
		}

		addElement(indexForNewElement, newElement);
	}

	function setElementAboveAnotherElement(active: any, over: any) {
		const activeId = active?.data?.current?.elementId;
		const overId = over?.data?.current?.elementId;
		const isDroppingOverDesignerElementBottomHalf =
			over?.data?.current?.isBottomHalfDesignerElement;
		const activeElementIndex = elements.findIndex(
			(element) => element.id === activeId,
		);
		const overElementIdIndex = elements.findIndex(
			(element) => element.id === overId,
		);

		if (activeElementIndex === -1 || overElementIdIndex === -1) {
			throw new Error('Element not found.');
		}

		const overElementIndex = elements.findIndex(
			(element) => element.id === overId,
		);

		if (overElementIndex === -1) {
			throw new Error('Element not found.');
		}

		const activeElement = { ...elements[activeElementIndex] };
		removeElement(activeId);

		let indexForNewElement = overElementIndex;
		if (isDroppingOverDesignerElementBottomHalf) {
			indexForNewElement = +1;
		}

		addElement(indexForNewElement, activeElement);
	}

	return (
		<div className={s.container}>
			<div className={s.canvas}>
				<div
					ref={droppable.setNodeRef}
					className={`${s.box} ${droppableIsOverClass}`}
				>
					{!droppable.isOver && elements.length === 0 && (
						<p className={s.dragAndDrop}>Drop here</p>
					)}
					{droppable.isOver && elements.length === 0 && (
						<div className={s.boxShadow}>
							<div className={s.boxShadowContent} />
						</div>
					)}
					{elements.length > 0 && (
						<div className={s.elements}>
							{elements.map((element) => (
								<DesignerElementWrapper key={element.id} element={element} />
							))}
						</div>
					)}
				</div>
			</div>
			<DesignerSidebar />
		</div>
	);
};
