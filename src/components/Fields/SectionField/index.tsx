"use client";

import { Blocks } from "lucide-react";
import type { ElementsType, FormElement } from "@/components/FormElements";

import { DesignerComponent } from "./DesignerComponent";
import { FormComponent } from "./FormComponent";
import { PropertiesComponent } from "./PropertiesComponent";

const type: ElementsType = "SectionField";

export const SectionFieldFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes: {
			template: null,
			content: "",
		},
	}),
	designerBtnElement: {
		icon: Blocks,
		label: "Seção",
	},
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,
	validate: () => true,
};
