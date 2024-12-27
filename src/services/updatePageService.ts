import { api } from "@/lib/api";

import type { ApiResponse } from "./types";
import type { Page } from "@/types/page";

type UpdatePageResponse = ApiResponse<Page>;

export async function updatePageService(
	slug: string,
	pageId: string,
	data: Partial<Page>,
): Promise<UpdatePageResponse> {
	try {
		const response = await api.patch(`/api/apps/${slug}/pages/${pageId}`, data);

		return {
			success: true,
			data: response.data,
		};
	} catch (error: any) {
		console.error("Erro ao atualizar página:", error);

		return {
			success: false,
			error: {
				code: error.response?.status === 404 ? "NOT_FOUND" : "SERVER_ERROR",
				message:
					error.response?.status === 404
						? "Página não encontrada"
						: "Erro ao atualizar página",
			},
		};
	}
}
