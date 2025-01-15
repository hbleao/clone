export interface Permission {
	id: string;
	name: string;
	slug: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
	metadata?: Record<string, unknown>;
}
