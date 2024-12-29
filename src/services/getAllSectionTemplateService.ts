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
	console.log("Fetching templates for slug:", slug);

	if (!slug) {
		console.error("No slug provided");
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
			next: { revalidate: 60 }, // Revalidar cache a cada 60 segundos
		});

		const data = await response.json();

		if (!response.ok) {
			// Trata erros específicos da API
			if (response.status === 404) {
				console.error("App não encontrado:", data);
				return {
					success: false,
					error: {
						message: "App não encontrado",
						code: "NOT_FOUND",
						details: data,
					},
				};
			}

			// Outros erros do servidor
			console.error("Erro ao buscar templates:", data);
			return {
				success: false,
				error: {
					message: "Erro ao buscar templates",
					code: "SERVER_ERROR",
					details: data,
				},
			};
		}

		// Valida a estrutura dos dados
		if (!Array.isArray(data)) {
			console.error("Resposta inválida:", data);
			return {
				success: false,
				error: {
					message: "Resposta inválida do servidor",
					code: "SERVER_ERROR",
					details: data,
				},
			};
		}

		// Processa e valida os templates
		const validTemplates = data
			.map((template) => {
				try {
					// Valida campos obrigatórios
					if (
						!template ||
						typeof template !== "object" ||
						!template.id ||
						!template.name ||
						!template.type
					) {
						console.warn("Template sem campos obrigatórios:", template);
						return null;
					}

					// Processa datas
					const processedTemplate = {
						...template,
						createdAt: template.createdAt ? new Date(template.createdAt) : new Date(),
						updatedAt: template.updatedAt ? new Date(template.updatedAt) : new Date(),
					};

					// Processa schema
					if (typeof template.schema === "string") {
						try {
							processedTemplate.schema = JSON.parse(template.schema);
						} catch (error) {
							console.error("Erro ao processar schema:", error);
							return null;
						}
					}

					// Valida schema
					if (
						!processedTemplate.schema ||
						typeof processedTemplate.schema !== "object" ||
						!Array.isArray(processedTemplate.schema.fields)
					) {
						console.warn("Template com schema inválido:", template);
						return null;
					}

					// Processa defaultData
					if (template.defaultData) {
						if (typeof template.defaultData === "string") {
							try {
								processedTemplate.defaultData = JSON.parse(template.defaultData);
							} catch (error) {
								console.error("Erro ao processar defaultData:", error);
								processedTemplate.defaultData = {};
							}
						}
					} else {
						processedTemplate.defaultData = {};
					}

					return processedTemplate as SectionTemplate;
				} catch (error) {
					console.error("Erro ao processar template:", error);
					return null;
				}
			})
			.filter((template): template is SectionTemplate => template !== null);

		if (validTemplates.length === 0) {
			console.warn("Nenhum template válido encontrado");
			return {
				success: false,
				error: {
					message: "Nenhum template válido encontrado",
					code: "NOT_FOUND",
				},
			};
		}

		return {
			success: true,
			data: validTemplates,
		};
	} catch (error) {
		// Erro de rede ou outros erros não tratados
		console.error("Erro ao buscar templates:", error);
		return {
			success: false,
			error: {
				message:
					error instanceof Error
						? error.message
						: "Erro ao conectar com o servidor",
				code: "NETWORK_ERROR",
				details: error,
			},
		};
	}
}
