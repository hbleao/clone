declare type User = {
	id: string;
	name: string;
	email: string;
	password: string;
	registration: string;
	role: string;
	createdAt: Date;
	updatedAt: Date;
	apps: App[];
};
