import { api } from "@/lib/api";

export type GetComponentResponse = {
	success: boolean;
	data?: {
		id: string;
		name: string;
		type: string;
		description: string;
		schema: {
			fields: any[];
		};
		createdAt: string;
		updatedAt: string;
	};
	error?: {
		message: string;
		code?: string;
	};
};

export async function getComponentService(
	appSlug: string,
	componentId: string,
): Promise<GetComponentResponse> {
	try {
		const response = await api.get(`/api/apps/${appSlug}/components/${componentId}`);

		return {
			success: true,
			data: response.data,
		};
	} catch (error: any) {
		console.error("Erro ao buscar componente:", error);

		return {
			success: false,
			error: {
				code: error.response?.status === 404 ? "NOT_FOUND" : "SERVER_ERROR",
				message:
					error.response?.status === 404
						? "Componente não encontrado"
						: "Erro ao buscar componente",
			},
		};
	}
}
