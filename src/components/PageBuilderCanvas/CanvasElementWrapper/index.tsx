import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import { Trash } from "lucide-react";

import s from "./styles.module.scss";

import { usePageBuilder } from "@/hooks";

import {
	type FormElementInstance,
	FormElements,
} from "@/components/FormElements";

import { PageBuilderAuthorDialog } from "@/components";

export type CanvasElementWrapperProps = {
	element: FormElementInstance;
};

export const CanvasElementWrapper = ({
	element,
}: CanvasElementWrapperProps) => {
	const { removeElement, setSelectedElement } = usePageBuilder();
	const [mouseIsOver, setMouseIsOver] = useState(false);
	const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
	const CanvasElement = FormElements[element.type].designerComponent;

	const topHalf = useDroppable({
		id: `${element.id}-top`,
		data: {
			type: element.type,
			elementId: element.id,
			isTopHalfDesignerElement: true,
		},
	});

	const bottomHalf = useDroppable({
		id: `${element.id}-bottom`,
		data: {
			type: element.type,
			elementId: element.id,
			isBottomHalfDesignerElement: true,
		},
	});

	const draggable = useDraggable({
		id: `${element.id}-drag-handler`,
		data: {
			type: element.type,
			elementId: element.id,
			isDesignerElement: true,
		},
	});

	if (draggable.isDragging) return null;

	return (
		<div
			className={`${s.designerElementWrapper} ${topHalf.isOver ? s.borderTopHalf : ""} ${bottomHalf.isOver ? s.borderBottomHalf : ""}`}
			onMouseEnter={() => setMouseIsOver(true)}
			onMouseLeave={() => setMouseIsOver(false)}
			onClick={(e) => {
				e.stopPropagation();
				setIsPropertiesOpen(true);
			}}
			ref={draggable.setNodeRef}
			{...draggable.listeners}
			{...draggable.attributes}
		>
			<div ref={topHalf.setNodeRef} className={s.top} />
			<div ref={bottomHalf.setNodeRef} className={s.bottom} />
			{mouseIsOver && (
				<>
					<div className={s.message}>
						<p>Click for properties or drag for move</p>
					</div>
					<div
						className={s.exclude}
						onClick={(e) => {
							e.stopPropagation();
							removeElement(element.id);
						}}
						onKeyDown={(e) => {
							e.stopPropagation();
							removeElement(element.id);
						}}
					>
						<Trash />
					</div>
				</>
			)}
			{topHalf.isOver && <div className={s.ghostBorderHalfTop} />}
			<CanvasElement elementInstance={element} />
			{bottomHalf.isOver && <div className={s.ghostBorderHalfBottom} />}

			{isPropertiesOpen && (
				<PageBuilderAuthorDialog
					onClose={() => setIsPropertiesOpen(false)}
					element={element}
				/>
			)}
		</div>
	);
};
