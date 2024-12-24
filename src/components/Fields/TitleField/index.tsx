"use client";

import { TextIcon } from "lucide-react";
import type { ElementsType, FormElement } from "../../FormElements";
import { DesignerComponent } from "./DesignerComponent";
import { FormComponent } from "./FormComponent";
import { PropertiesComponent } from "./PropertiesComponent";

const type: ElementsType = "TitleField";

export const TitleFieldFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes: {
			title: "Title field",
		},
	}),
	designerBtnElement: {
		icon: TextIcon,
		label: "Title Field",
	},
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,
	validate: () => true,
};
