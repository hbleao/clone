import { createComponent } from "@/actions/component";

interface ComponentData {
	name: string;
	type: string;
	description?: string;
	schema?: Record<string, any>;
}

interface CreateComponentResponse {
	success: boolean;
	data?: {
		id: string;
		name: string;
		type: string;
		description: string | null;
		schema: Record<string, any>;
		createdAt: string;
		updatedAt: string;
	};
	error?: {
		message: string;
		details?: any;
	};
}

export const createComponentService = async (
	appSlug: string,
	data: ComponentData
): Promise<CreateComponentResponse> => {
	try {
		// Validar dados obrigatórios
		if (!data.name?.trim()) {
			return {
				success: false,
				error: {
					message: "O nome do componente é obrigatório",
				},
			};
		}

		if (!data.type?.trim()) {
			return {
				success: false,
				error: {
					message: "O tipo do componente é obrigatório",
				},
			};
		}

		const result = await createComponent(appSlug, {
			...data,
			schema: data.schema || {},
		});

		if (result.success && result.data) {
			return {
				success: true,
				data: {
					...result.data,
					createdAt: result.data.createdAt.toString(),
					updatedAt: result.data.updatedAt.toString(),
					schema: result.data.schema ? JSON.parse(result.data.schema) : {},
				},
			};
		}

		return {
			success: false,
			error: {
				message: result.error || "Erro ao criar componente",
				details: result.error,
			},
		};
	} catch (error) {
		console.error("Erro ao criar componente:", error);
		return {
			success: false,
			error: {
				message: "Erro ao criar componente",
				details: error,
			},
		};
	}
};
