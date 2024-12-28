"use client";

import { Blocks } from "lucide-react";
import type { ElementsType, FormElement } from "@/types/form";

import { SectionFieldDesignerComponent } from "./DesignerComponent";
import { FormComponent } from "./FormComponent";
import { PropertiesComponent } from "./PropertiesComponent";

// Definir o tipo primeiro
const type: ElementsType = "SectionField";

// Definir o elemento do formulário
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
	designerComponent: SectionFieldDesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,
	validate: () => true,
};
