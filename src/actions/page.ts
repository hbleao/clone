"use server";

import { prisma } from "../lib/prisma";

export interface Seo {
	id?: string;
	title?: string | null;
	description?: string | null;
	keywords?: string | null;
	canonical?: string | null;
	robots?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
	pageId?: string;
}

export interface Page {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	content: string | null;
	appId: string;
	type: string;
	slug: string;
	title: string;
	status: string;
	author: string;
	publishedAt: Date | null;
	templateId: string | null;
	seo?: Seo;
}

interface CreatePageData {
	title: string;
	slug: string;
	type: string;
	content?: string;
	appId: string;
	author: string;
	seo?: Seo;
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
	seo?: Seo;
}

export async function createPage(data: CreatePageData) {
	try {
		const app = await prisma.app.findUnique({
			where: { id: data.appId },
		});

		if (!app) {
			return { success: false, error: "Aplicativo não encontrado" };
		}

		const existingPage = await prisma.page.findFirst({
			where: {
				AND: [{ appId: data.appId }, { slug: data.slug }],
			},
		});

		if (existingPage) {
			throw new Error("Já existe uma página com este slug neste app");
		}

		const content = data.content
			? typeof data.content === "string"
				? data.content
				: JSON.stringify(data.content)
			: undefined;

		const page = await prisma.page.create({
			data: {
				title: data.title,
				slug: data.slug,
				type: data.type,
				content: content,
				status: "draft",
				appId: data.appId,
				author: data.author,
				seo: data.seo
					? {
							create: {
								title: data.seo.title,
								description: data.seo.description,
								keywords: data.seo.keywords,
								canonical: data.seo.canonical,
								robots: data.seo.robots,
							},
						}
					: undefined,
			},
			include: {
				seo: true,
			},
		});

		return { success: true, page };
	} catch (error) {
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
			include: {
				seo: true,
			},
		});

		return { success: true, pages };
	} catch (error) {
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
				AND: [{ appId }, { slug }],
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

		let parsedContent = [];
		try {
			if (typeof page.content === "string") {
				parsedContent = JSON.parse(page.content);
			} else if (page.content) {
				parsedContent = page.content;
			}
		} catch (error) {}

		const processedPage = {
			...page,
			content: parsedContent,
		};

		return { success: true, page: processedPage };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erro ao buscar página",
		};
	}
}

export async function updatePage(pageId: string, data: UpdatePageData) {
	try {
		const processedData = {
			...data,
			content: JSON.stringify(data.content),
		};

		const page = await prisma.page.update({
			where: { id: pageId },
			data: processedData,
		});

		return { success: true, page };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Erro ao atualizar página",
		};
	}
}

export async function updatePageFull(currentPage: UpdatePageParams) {
	try {
		const content = JSON.stringify(currentPage.content);

		const page = await prisma.page.update({
			where: { id: currentPage.id },
			data: {
				title: currentPage.title,
				slug: currentPage.slug,
				type: currentPage.type,
				content,
				status: currentPage.status,
				seo: currentPage.seo
					? {
							upsert: {
								create: {
									title: currentPage.seo.title,
									description: currentPage.seo.description,
									keywords: currentPage.seo.keywords,
									canonical: currentPage.seo.canonical,
									robots: currentPage.seo.robots,
								},
								update: {
									title: currentPage.seo.title,
									description: currentPage.seo.description,
									keywords: currentPage.seo.keywords,
									canonical: currentPage.seo.canonical,
									robots: currentPage.seo.robots,
								},
							},
						}
					: undefined,
			},
			include: {
				seo: true,
			},
		});

		return { success: true, page };
	} catch (error) {
		return { success: false, error: "Falha ao atualizar página" };
	}
}

export async function deletePage(pageId: string) {
	try {
		await prisma.page.delete({
			where: { id: pageId },
		});

		return { success: true };
	} catch (error) {
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
		return { success: false, error: "Falha ao deletar página" };
	}
}

export async function duplicatePage(pageId: string) {
	try {
		const page = await prisma.page.findUnique({
			where: { id: pageId },
			include: {
				seo: true,
			},
		});

		if (!page) {
			return { success: false, error: "Página não encontrada" };
		}

		const baseSlug = `${page.slug}-copia`;
		let uniqueSlug = baseSlug;
		let counter = 1;

		let existingPage: { id: string } | null;
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
		return {
			success: false,
			error: "Erro interno ao duplicar página",
		};
	}
}
