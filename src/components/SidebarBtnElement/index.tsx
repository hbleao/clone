'use client';
import s from './styles.module.scss';

import { useDraggable } from '@dnd-kit/core';
import type { FormElement } from '../FormElements';

export type SidebarBtnElementProps = {
	formElement: FormElement;
};

export const SidebarBtnElement = ({ formElement }: SidebarBtnElementProps) => {
	const { icon: Icon, label } = formElement.designerBtnElement;
	const draggable = useDraggable({
		id: `designer-id-${formElement.type}`,
		data: {
			type: formElement.type,
			isDesignerBtnElement: true,
		},
	});
	const draggableClass = draggable.isDragging ? s.isDragging : '';

	return (
		<button
			ref={draggable.setNodeRef}
			type="button"
			className={`${s.button} ${draggableClass}`}
			{...draggable.listeners}
			{...draggable.attributes}
		>
			<Icon />
			<p>{label}</p>
		</button>
	);
};

export const SidebarBtnElementDragOverlay = ({
	formElement,
}: SidebarBtnElementProps) => {
	const { icon: Icon, label } = formElement.designerBtnElement;

	return (
		<button type="button" className={s.button}>
			<Icon />
			<p>{label}</p>
		</button>
	);
};
