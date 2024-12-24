"use client";

import { TextIcon } from "lucide-react";
import type { ElementsType, FormElement } from "../../FormElements";
import { DesignerComponent } from "./DesignerComponent";
import { FormComponent } from "./FormComponent";
import { PropertiesComponent } from "./PropertiesComponent";

const type: ElementsType = "SubTitleField";

export const SubTitleFieldFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes: {
			title: "SubTitle field",
		},
	}),
	designerBtnElement: {
		icon: TextIcon,
		label: "SubTitle Field",
	},
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,
	validate: () => true,
};
