declare type Seo = {
	id: string;
	title?: string | null;
	description?: string | null;
	keywords?: string | null;
	canonical?: string | null;
	robots?: string | null;
	pageId: string;
	createdAt: DateTime;
	updatedAt: DateTime;
};
