import { api } from "@/lib/api";

import type { ApiResponse } from "./types";
import type { Page } from "@/types/page";

type GetPageResponse = ApiResponse<Page>;

export async function getPageService(
	slug: string,
	pageId: string,
): Promise<GetPageResponse> {
	try {
		const response = await api.get(`/api/apps/${slug}/pages/${pageId}`);

		return {
			success: true,
			data: response.data,
		};
	} catch (error: any) {
		console.error("Erro ao buscar página:", error);

		return {
			success: false,
			error: {
				code: error.response?.status === 404 ? "NOT_FOUND" : "SERVER_ERROR",
				message:
					error.response?.status === 404
						? "Página não encontrada"
						: "Erro ao buscar página",
			},
		};
	}
}
