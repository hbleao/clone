import React from "react";

import s from "./styles.module.scss";

export type Component = {
	id: string;
	name: string;
	type: string;
	description: string;
	thumbnail?: string;
	schema: string;
	defaultData?: string;
	createdAt: Date;
	updatedAt: Date;
	appId: string;
};

interface DraggableComponentItemProps {
	component: Component;
	onSelectComponent: (component: Component) => void;
}

export function DraggableComponentItem({
	component,
	onSelectComponent,
}: DraggableComponentItemProps) {
	const handleClick = () => {
		onSelectComponent(component);
	};

	return (
		<>
			<div
				className={s.draggableItem}
				onClick={handleClick}
				onKeyDown={handleClick}
			>
				<h3 className={s.title}>{component.name}</h3>
			</div>
		</>
	);
}
