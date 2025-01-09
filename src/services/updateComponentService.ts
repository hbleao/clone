import { updateComponent } from "@/actions/component";

export type UpdateComponentResponse = {
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
	error?: string | { message: string }[];
};

export async function updateComponentService(
	componentId: string,
	data: any,
): Promise<UpdateComponentResponse> {
	try {
		const response = await updateComponent(componentId, data);

		return {
			success: true,
			data: response.data,
		};
	} catch (error: any) {
		console.error("Erro ao atualizar componente:", error);

		if (error.response?.data?.error) {
			return {
				success: false,
				error: error.response.data.error,
			};
		}

		return {
			success: false,
			error: "Erro ao atualizar componente",
		};
	}
}
