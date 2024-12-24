"use server";

import { prisma } from "@/lib/prisma";

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
	try {
		// Verifica se o app existe
		const app = await prisma.app.findUnique({
			where: { id: data.appId },
		});

		if (!app) {
			return { success: false, error: "Aplicativo não encontrado" };
		}

		// Verifica se já existe uma página com o mesmo slug no app
		const existingPage = await prisma.page.findFirst({
			where: {
				appId: data.appId,
				slug: data.slug,
			},
		});

		if (existingPage) {
			return { success: false, error: "Já existe uma página com este slug" };
		}

		// Cria a página
		const page = await prisma.page.create({
			data: {
				title: data.title,
				slug: data.slug,
				type: data.type,
				content: data.content || "",
				appId: data.appId,
				author: data.author,
				status: "draft",
			},
		});

		return { success: true, page };
	} catch (error) {
		console.error("Erro ao criar página:", error);
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

		return { success: true, pages };
	} catch (error) {
		console.error("Erro ao buscar páginas:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erro ao buscar páginas",
		};
	}
}

export async function getPageBySlug(appId: string, slug: string) {
	try {
		const page = await prisma.page.findFirst({
			where: {
				appId,
				slug,
			},
			include: {
				seo: true,
			},
		});

		if (!page) {
			return { success: false, error: "Página não encontrada" };
		}

		return { success: true, page };
	} catch (error) {
		console.error("Erro ao buscar página:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erro ao buscar página",
		};
	}
}

export async function getPageById(id: string) {
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
			return { success: false, error: "Página não encontrada" };
		}

		return { success: true, page };
	} catch (error) {
		console.error("Erro ao buscar página:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erro ao buscar página",
		};
	}
}

export async function updatePage(pageId: string, data: UpdatePageData) {
	try {
		const page = await prisma.page.update({
			where: { id: pageId },
			data,
		});

		return { success: true, page };
	} catch (error) {
		console.error("Erro ao atualizar página:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Erro ao atualizar página",
		};
	}
}

export async function updatePageFull(params: UpdatePageParams) {
	try {
		const page = await prisma.page.update({
			where: { id: params.id },
			data: {
				title: params.title,
				slug: params.slug,
				type: params.type,
				content: params.content,
				status: params.status,
				seo: params.seo,
			},
		});

		return { success: true, page };
	} catch (error) {
		console.error("Error updating page:", error);
		return { success: false, error: "Failed to update page" };
	}
}

export async function deletePage(pageId: string) {
	try {
		await prisma.page.delete({
			where: { id: pageId },
		});

		return { success: true };
	} catch (error) {
		console.error("Erro ao deletar página:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erro ao deletar página",
		};
	}
}

export async function deletePageById(id: string) {
	try {
		await prisma.page.delete({
			where: { id },
		});

		return { success: true };
	} catch (error) {
		console.error("Error deleting page:", error);
		return { success: false, error: "Failed to delete page" };
	}
}
