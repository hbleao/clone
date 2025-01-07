import { getComponentsByAppId } from "@/actions/component";

interface getComponentsBySlugServiceResponse {
	success: boolean;
	data?: any[];
	error?: {
		message: string;
	};
}

export const getComponentsBySlugService = async (
	appSlug: string,
): Promise<getComponentsBySlugServiceResponse> => {
	try {
		const result = await getComponentsByAppId(appSlug);

		if (result.success) {
			return {
				success: true,
				data: result.data.map((comp) => ({
					...comp,
					createdAt: comp.createdAt.toString(),
					updatedAt: comp.updatedAt.toString(),
				})),
			};
		}

		return {
			success: false,
			error: {
				message: result.error || "Erro ao carregar componentes",
			},
		};
	} catch (error) {
		console.error("Erro ao carregar componentes:", error);
		return {
			success: false,
			error: {
				message: "Erro ao carregar componentes",
			},
		};
	}
};
