declare type Seo = {
	id: string;
	title: string;
	description?: string;
	keywords?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	canonical?: string;
	robots?: string;
	pageId: string;
	createdAt: DateTime;
	updatedAt: DateTime;
	page: Page;
};
