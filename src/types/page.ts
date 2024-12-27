import type { SectionTemplate } from "./section";

export type PageSection = {
	id: string;
	templateId: string;
	template: SectionTemplate;
	data: Record<string, any>;
	order: number;
};

export type Page = {
	id: string;
	name: string;
	slug: string;
	sections: PageSection[];
	createdAt: Date;
	updatedAt: Date;
};
