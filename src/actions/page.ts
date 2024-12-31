"use server";

import { prisma } from "../lib/prisma";
import type { ElementsType, FormElementInstance } from "../components";

import { logger } from "@/utils";

interface CreatePageData {
	title: string;
	slug: string;
	type: string;
	content?: string;
	appId: string;
	author: string;
}

interface UpdatePageData {
	title?: string;
	slug?: string;
	type?: string;
	content?: string;
	status?: "draft" | "live";
}

interface UpdatePageParams {
	id: string;
	title: string;
	slug: string;
	type: string;
	content: string;
	status: "draft" | "live";
	seo: {
		title: string;
		description: string;
		keywords: string;
		ogTitle: string;
		ogDescription: string;
		ogImage: string;
		canonical: string;
		robots: string;
	};
}

export async function createPage(data: CreatePageData) {
	logger.info("Creating page with data:", data);
	try {
		const app = await prisma.app.findUnique({
			where: { id: data.appId },
		});

		if (!app) {
			logger.warn(`Aplicativo não encontrado: ${data.appId}`);
			return { success: false, error: "Aplicativo não encontrado" };
		}

		const content = data.content
			? typeof data.content === "string"
				? data.content
				: JSON.stringify(data.content)
			: undefined;

		const existingPage = await prisma.page.findFirst({
			where: {
				appId_slug: {
					appId: data.appId,
					slug: data.slug,
				},
			},
		});

		if (existingPage) {
			logger.warn(`Já existe uma página com este slug: ${data.slug}`);
			return { success: false, error: "Já existe uma página com este slug" };
		}

		const page = await prisma.page.create({
			data: {
				...data,
				content,
			},
		});

		logger.info(`Página criada com sucesso: ${page.id}`);
		return { success: true, page };
	} catch (error) {
		logger.error("Erro ao criar página:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erro ao criar página",
		};
	}
}

export async function getPagesByAppId(appId: string) {
	try {
		const pages = await prisma.page.findMany({
			where: {
				appId,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		logger.info(`Páginas buscadas para o aplicativo: ${appId}`);
		return { success: true, pages };
	} catch (error) {
		logger.error("Erro ao buscar páginas:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erro ao buscar páginas",
		};
	}
}

export async function getPageBySlug(appId: string, slug: string) {
	logger.info("Fetching page by slug:", { appId, slug });
	try {
		const page = await prisma.page.findFirst({
			where: {
				appId_slug: {
					appId,
					slug,
				},
			},
			include: {
				seo: true,
			},
		});

		if (!page) {
			logger.warn(`Página não encontrada para o slug: ${slug}`);
			return { success: false, error: "Página não encontrada" };
		}

		logger.info(`Página encontrada: ${page.id}`);
		return { success: true, page };
	} catch (error) {
		logger.error("Erro ao buscar página:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erro ao buscar página",
		};
	}
}

export async function getPageById(id: string) {
	logger.info("Fetching page by ID:", id);
	try {
		const page = await prisma.page.findFirst({
			where: {
				id,
			},
			include: {
				seo: true,
			},
		});

		if (!page) {
			logger.warn(`Página não encontrada para o ID: ${id}`);
			return { success: false, error: "Página não encontrada" };
		}

		logger.info("Content from DB:", {
			content: page.content,
			type: typeof page.content,
		});

		let parsedContent = [];
		try {
			// Se o conteúdo for string, tenta fazer parse
			if (typeof page.content === "string") {
				parsedContent = JSON.parse(page.content);
			} else if (page.content) {
				parsedContent = page.content;
			}

			logger.info("Parsed content:", {
				content: parsedContent,
				type: typeof parsedContent,
				isArray: Array.isArray(parsedContent),
			});
		} catch (error) {
			logger.error("Erro ao fazer parse do conteúdo:", error);
		}

		const processedPage = {
			...page,
			content: parsedContent,
		};

		logger.info("Final processed page:", {
			content: processedPage.content,
			type: typeof processedPage.content,
			isArray: Array.isArray(processedPage.content),
		});

		return { success: true, page: processedPage };
	} catch (error) {
		logger.error("Erro ao buscar página:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erro ao buscar página",
		};
	}
}

export async function updatePage(pageId: string, data: UpdatePageData) {
	logger.info("Updating page:", { pageId, data });
	try {
		// Se o conteúdo for objeto, converte para string
		const processedData = {
			...data,
			content: data.content
				? typeof data.content === "string"
					? data.content
					: JSON.stringify(data.content)
				: undefined,
		};

		logger.info("Processed data for update:", {
			original: data.content,
			processed: processedData.content,
		});

		const page = await prisma.page.update({
			where: { id: pageId },
			data: processedData,
		});

		logger.info(`Página atualizada com sucesso: ${page.id}`);
		return { success: true, page };
	} catch (error) {
		logger.error("Erro ao atualizar página:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Erro ao atualizar página",
		};
	}
}

export async function updatePageFull(params: UpdatePageParams) {
	logger.info("Updating page fully:", { id: params.id });
	try {
		const content =
			typeof params.content === "string"
				? params.content
				: JSON.stringify(params.content);

		const page = await prisma.page.update({
			where: { id: params.id },
			data: {
				title: params.title,
				slug: params.slug,
				type: params.type,
				content,
				status: params.status,
				seo: {
					upsert: {
						create: params.seo,
						update: params.seo,
					},
				},
			},
		});

		logger.info(`Página atualizada completamente: ${page.id}`);
		return { success: true, page };
	} catch (error) {
		logger.error("Erro ao atualizar página:", error);
		return { success: false, error: "Falha ao atualizar página" };
	}
}

export async function deletePage(pageId: string) {
	logger.info("Deleting page with ID:", pageId);
	try {
		await prisma.page.delete({
			where: { id: pageId },
		});

		logger.info(`Página deletada com sucesso: ${pageId}`);
		return { success: true };
	} catch (error) {
		logger.error("Erro ao deletar página:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erro ao deletar página",
		};
	}
}

export async function deletePageById(id: string) {
	logger.info("Deleting page by ID:", id);
	try {
		await prisma.page.delete({
			where: { id },
		});

		logger.info(`Página deletada com sucesso pelo ID: ${id}`);
		return { success: true };
	} catch (error) {
		logger.error("Erro ao deletar página:", error);
		return { success: false, error: "Falha ao deletar página" };
	}
}

export async function duplicatePage(pageId: string) {
	try {
		// Buscar página completa com todas as relações
		const page = await prisma.page.findUnique({
			where: { id: pageId },
			include: {
				seo: true,
				// Adicionar outras relações se necessário
			},
		});

		if (!page) {
			return { success: false, error: "Página não encontrada" };
		}

		// Gerar slug único
		const baseSlug = `${page.slug}-copia`;
		let uniqueSlug = baseSlug;
		let counter = 1;

		// Verificar se já existe um slug igual
		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let existingPage;
		do {
			existingPage = await prisma.page.findUnique({
				where: {
					appId_slug: {
						appId: page.appId,
						slug: uniqueSlug,
					},
				},
			});
			if (existingPage) {
				uniqueSlug = `${baseSlug}-${counter}`;
				counter++;
			}
		} while (existingPage);

		const newPage = await prisma.page.create({
			data: {
				title: `Cópia de ${page.title}`,
				slug: uniqueSlug,
				type: page.type,
				status: "draft",
				appId: page.appId,
				userId: page.userId,
				content: page.content,
				author: page.author,
			},
			include: {
				seo: true,
			},
		});

		return {
			success: true,
			page: newPage,
		};
	} catch (error) {
		console.error("Erro ao duplicar página:", error);
		return {
			success: false,
			error: "Erro interno ao duplicar página",
		};
	}
}
