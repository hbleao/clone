import { TextIcon } from "lucide-react";

import s from "./styles.module.scss";

import { useDesigner } from "@/hooks";

import { Button } from "../Button";
import { FormElements } from "../FormElements";

export const PropertiesFormSidebar = () => {
	const { selectedElement, setSelectedElement } = useDesigner();

	if (!selectedElement) return null;

	const PropertiesForm =
		FormElements[selectedElement?.type].propertiesComponent;

	return (
		<div className={s.propertiesFromSidebar}>
			<header className={s.header}>
				<p>Element Properties</p>
				<Button
					type="button"
					width="contain"
					onClick={() => setSelectedElement(null)}
				>
					<TextIcon />
				</Button>
			</header>
			<PropertiesForm elementInstance={selectedElement} />
		</div>
	);
};
