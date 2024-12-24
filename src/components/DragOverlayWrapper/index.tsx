'use client';
import { type Active, DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { useState } from 'react';

import { useDesigner } from '@/hooks';

import { type ElementsType, FormElements } from '../FormElements';
import { SidebarBtnElementDragOverlay } from '../SidebarBtnElement';

export const DragOverlayWrapper = () => {
	const { elements } = useDesigner();
	const [draggedItem, setDraggedItem] = useState<Active | null>(null);
	useDndMonitor({
		onDragStart: (event) => {
			setDraggedItem(event.active);
		},
		onDragCancel: () => {
			setDraggedItem(null);
		},
		onDragEnd: () => {
			setDraggedItem(null);
		},
	});

	if (!draggedItem) return;

	let node = <div>No drag overlay</div>;
	const isSidebarBtnElement = draggedItem?.data?.current?.isDesignerBtnElement;

	if (isSidebarBtnElement) {
		const type = draggedItem?.data?.current?.type as ElementsType;
		node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />;
	}

	const isDesignerElement = draggedItem.data?.current?.isDesignerElement;

	if (isDesignerElement) {
		const elementId = draggedItem.data?.current?.elementId;
		const element = elements.find((element) => element.id === elementId);

		if (!element) {
			node = <div>Element not found!</div>;
		} else {
			const DesignerElementComponent =
				FormElements[element.type].designerComponent;

			node = (
				<div
					style={{
						width: '100%',
						backgroundColor: '#16873f4d',
						borderRadius: '6px',
						padding: '0.5rem',
						pointerEvents: 'none',
					}}
				>
					<DesignerElementComponent elementInstance={element} />
				</div>
			);
		}
	}

	return <DragOverlay>{node}</DragOverlay>;
};
