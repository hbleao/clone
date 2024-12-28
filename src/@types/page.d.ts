declare type Page = {
	id: string;
	title: string;
	slug: string;
	content?: string;
	status: string;
	type: string;
	author: string;
	appId: string;
	createdAt: Date;
	updatedAt: Date;
	publishedAt?: Date;
	app: App;
	seo?: Seo;
};
