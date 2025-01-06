import type { AppRole } from "@/lib/permitions";

export type User = {
	id: string;
	name: string;
	email: string;
};

export type App = {
	id: string;
	title: string;
	name: string;
};

export type AppMembership = {
	id: string;
	userId: string;
	appId: string;
	role: AppRole;
	user?: User;
	app?: App;
};

export type FormData = {
	userId: string;
	appId: string;
	role: AppRole;
};
