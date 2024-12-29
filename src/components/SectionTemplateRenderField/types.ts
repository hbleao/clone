import type { Dispatch, SetStateAction } from "react";

export interface Field {
	name: string;
	type: string;
	label: string;
	required?: boolean;
	options?: Array<{ value: string; label: string }>;
	fields?: Field[];
	arrayType?: Field;
}

export interface SectionTemplateRenderFieldProps {
	field: Field;
	formData: Record<string, any>;
	setFormData: Dispatch<SetStateAction<Record<string, any>>>;
}
