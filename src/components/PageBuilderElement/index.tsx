"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { PageBuilderElementProps } from "@/types/pageBuilder";
import { SectionElement } from "./SectionElement";

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
        <SectionElement
          element={element}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      </div>
    );
  }

  return null;
}
