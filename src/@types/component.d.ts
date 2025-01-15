declare type Component = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	description: string | null;
	content: string | null;
	appId: string;
	type: string;
	schema: string;
	slug: string;
};

declare type CreateComponent = {
	name: string;
	description: string | null;
	content: string | null;
	appId: string;
	type: string;
	schema: string;
	slug: string;
} & { appSlug: string };
