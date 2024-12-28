declare type SectionTemplate = {
	id: string;
	name: string;
	type: string;
	description: string;
	thumbnail?: string;
	schema: string;
	defaultData?: string;
	createdAt: DateTime;
	updatedAt: DateTime;
	appId: string;
	app: App;
};

export type SectionTemplateType =
	| "hero"
	| "features"
	| "testimonials"
	| "pricing"
	| "contact"
	| "custom";

declare type Field = {
	name: string;
	type: string;
	label: string;
	required?: boolean;
	options?: Array<{ value: string; label: string }>;
	fields?: Field[];
	arrayType?: Field;
};

declare type SectionField = Field;

declare type SectionTemplateField = {
	id: string;
	name: string;
	type: SectionTemplateType;
	description: string;
	thumbnail?: string;
	schema: {
		fields: Array<Field>;
	};
	defaultData?: string;
};
