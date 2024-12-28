declare type App = {
	id: string;
	title: string;
	name: string;
	slug: string;
	description?: string;
	owner: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	user: User;
	page: Page[];
	SectionTemplate: SectionTemplate[];
};
