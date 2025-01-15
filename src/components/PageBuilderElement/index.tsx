"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { SectionElement } from "./SectionElement";

export interface ElementType {
	id: string;
	type: string;
	template: {
		id: string;
		name: string;
		defaultData: Record<string, unknown>;
	};
	content: Record<string, unknown>;
}

interface PageBuilderElementProps {
	element: ElementType;
	onEdit: (updatedElement: ElementType) => void;
	onRemove: (id: string) => void;
}

export function PageBuilderElement({
	element,
	onEdit,
	onRemove,
}: PageBuilderElementProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: element.id,
		data: {
			type: "section",
			element,
		},
	});

	console.log("ELEMENT:", element);

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	if (element.type === "section") {
		return (
			<div
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}
				aria-describedby={`section-${element.id}`}
			>
				<SectionElement element={element} onEdit={onEdit} onRemove={onRemove} />
			</div>
		);
	}

	return null;
}
