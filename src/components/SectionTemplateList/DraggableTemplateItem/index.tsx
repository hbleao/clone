import React from "react";
import type { SectionTemplate } from "@/types/section";

import s from "./styles.module.scss";

interface DraggableTemplateItemProps {
	template: SectionTemplate;
	onSelectTemplate: (template: SectionTemplate) => void;
}

export function DraggableTemplateItem({
	template,
	onSelectTemplate,
}: DraggableTemplateItemProps) {
	const handleClick = () => {
		console.log("Template completo selecionado:", {
			id: template.id,
			name: template.name,
			type: template.type,
			defaultData: template.defaultData,
			defaultDataType: typeof template.defaultData,
			schema: template.schema,
			schemaType: typeof template.schema,
		});

		onSelectTemplate(template);
	};

	return (
		<>
			<div
				className={s.draggableItem}
				onClick={handleClick}
				onKeyDown={handleClick}
			>
				<h3 className={s.title}>{template.name}</h3>
				{/* <p>{template.description}</p> */}
				{/* <div className={s.fields}>
					{template.schema?.fields?.length || 0} campo(s)
				</div> */}
			</div>
		</>
	);
}
