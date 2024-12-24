"use client";

import { TextIcon } from "lucide-react";
import type { ElementsType, FormElement } from "../../FormElements";
import { DesignerComponent } from "./DesignerComponent";
import { FormComponent } from "./FormComponent";
import { PropertiesComponent } from "./PropertiesComponent";

const type: ElementsType = "SpacerField";

export const SpacerFieldFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes: {
			height: 20, // px
		},
	}),
	designerBtnElement: {
		icon: TextIcon,
		label: "Spacer Field",
	},
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,
	validate: () => true,
};
