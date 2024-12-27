"use client";

import type { SectionTemplateFormData } from "@/actions/sectionTemplate";

interface CreateTemplateResponse {
	success: boolean;
	data?: any;
	error?: string | { message: string }[];
}

export async function createSectionTemplateService(
	slug: string,
	data: SectionTemplateFormData,
): Promise<CreateTemplateResponse> {
	try {
		const response = await fetch(`/api/apps/${slug}/templates`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json();

			// Se for um array de erros de validação
			if (Array.isArray(errorData.error)) {
				return {
					success: false,
					error: errorData.error.map((err: any) => ({
						message: err.message || "Erro de validação",
					})),
				};
			}

			// Se for um erro simples
			return {
				success: false,
				error: errorData.error || "Erro ao criar template",
			};
		}

		const result = await response.json();

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		console.error("Erro ao criar template:", error);
		return {
			success: false,
			error: "Erro ao conectar com o servidor. Tente novamente.",
		};
	}
}

export * from "./getAllSectionTemplateService";
export * from "./createSectionTemplateService";
export * from "./getPageService";
export * from "./updatePageService";
