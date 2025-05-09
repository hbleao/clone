export interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	createdAt: string;
	updatedAt: string;
	metadata?: Record<string, unknown>;
}
