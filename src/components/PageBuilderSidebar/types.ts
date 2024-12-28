export type SectionTemplateType =
	| "hero"
	| "features"
	| "testimonials"
	| "pricing"
	| "contact"
	| "custom";

export interface SectionTemplate {
	id: string;
	name: string;
	type: SectionTemplateType;
	description: string;
	thumbnail?: string;
	schema: {
		fields: Array<{
			name: string;
			type: string;
			label: string;
			required?: boolean;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			options?: any[];
		}>;
	};
	defaultData?: string;
}
