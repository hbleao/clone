import type {
	ElementsType,
	FormElement,
	FormElementInstance,
	FormElementsType,
} from "@/types/form";

// Importar cada componente individualmente para evitar referência circular
import { SectionFieldFormElement } from "../PageBuilderSectionOnCanvas";

export type {
	ElementsType,
	FormElement,
	FormElementInstance,
	FormElementsType,
};

// Definir os elementos do formulário
export const FormElements: FormElementsType = {
	SectionField: SectionFieldFormElement,
};
