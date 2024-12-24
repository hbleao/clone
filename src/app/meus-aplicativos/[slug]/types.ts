export interface App {
	id: string;
	name: string;
	description?: string;
	owner: string;
	userId: string;
	slug: string;
};

export interface Page {
	id: string;
	title: string;
	slug: string;
	type: string;
	status: "draft" | "live";
	createdAt: string;
	updatedAt: string;
	author: string;
};

export interface PageForm {
	// Page Info
	title: string;
	slug: string;
	type: string;
	content: string;
	status: "draft" | "live";
	// SEO Info
	seo: {
		title: string;
		description: string;
		keywords: string;
		ogTitle: string;
		ogDescription: string;
		ogImage: string;
		canonical: string;
		robots: string;
	};
};
