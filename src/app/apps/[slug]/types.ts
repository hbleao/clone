export interface App {
	id: string;
	name: string;
	description?: string;
	owner: string;
	userId: string;
	slug: string;
}

export interface Page {
	id: string;
	title: string;
	slug: string;
	type: string;
	content: string;
	status: "draft" | "live";
	createdAt: string;
	updatedAt: string;
	author: string;
	seo?: Seo;
}

export interface PageForm {
	title: string;
	slug: string;
	type: string;
	content: string;
	status: "draft" | "live";
	seo?: Seo;
}
