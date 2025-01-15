export interface Template {
	id: string;
	name: string;
	slug: string;
	description?: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	metadata?: Record<string, unknown>;
}
