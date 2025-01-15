export interface Page {
	id: string;
	title: string;
	slug: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	appId: string;
	author: string;
	type: string;
	status: "draft" | "live";
	publishedAt: Date | null;
	templateId: string | null;
	seo?: {
		id: string;
		title: string | null;
		description: string | null;
		keywords: string | null;
		canonical: string | null;
		robots: string | null;
		createdAt: Date;
		updatedAt: Date;
		pageId: string;
	};
}

export type PageWithSeo = Page & {
	seo: NonNullable<Page["seo"]>;
};
