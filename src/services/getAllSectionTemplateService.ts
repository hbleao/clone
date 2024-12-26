import type { SectionTemplate } from "@/types/section";

interface GetTemplatesResponse {
	success: boolean;
	data?: SectionTemplate[];
	error?: {
		message: string;
		code: "NOT_FOUND" | "SERVER_ERROR" | "NETWORK_ERROR";
		details?: unknown;
	};
}

/**
 * Busca todos os templates de seção de um app
 * @param slug - Slug do app
 * @returns Promise com a resposta tipada
 */
export async function getAllSectionTemplateService(
	slug: string,
): Promise<GetTemplatesResponse> {
	if (!slug) {
		return {
			success: false,
			error: {
				message: "Slug do app é obrigatório",
				code: "NOT_FOUND",
			},
		};
	}

	try {
		const response = await fetch(`/api/apps/${slug}/templates`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		if (!response.ok) {
			// Trata erros específicos da API
			if (response.status === 404) {
				return {
					success: false,
					error: {
						message: "App não encontrado",
						code: "NOT_FOUND",
						details: data.error,
					},
				};
			}

			return {
				success: false,
				error: {
					message: data.error || "Erro ao buscar templates",
					code: "SERVER_ERROR",
					details: data.error,
				},
			};
		}

		// Valida se os dados retornados são um array
		if (!Array.isArray(data)) {
			return {
				success: false,
				error: {
					message: "Formato de resposta inválido",
					code: "SERVER_ERROR",
				},
			};
		}

		// Converte as datas de string para Date
		const templates = data.map((template) => ({
			...template,
			createdAt: new Date(template.createdAt),
			updatedAt: new Date(template.updatedAt),
			// Converte os campos JSON de string para objeto
			schema: typeof template.schema === "string"
				? JSON.parse(template.schema)
				: template.schema,
			defaultData: template.defaultData
				? typeof template.defaultData === "string"
					? JSON.parse(template.defaultData)
					: template.defaultData
				: null,
		}));

		return {
			success: true,
			data: templates,
		};
	} catch (error) {
		console.error("Erro ao buscar templates:", error);
		return {
			success: false,
			error: {
				message: "Erro ao conectar com o servidor",
				code: "NETWORK_ERROR",
				details: error,
			},
		};
	}
}
