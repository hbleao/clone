import { prisma } from "@/lib/prisma";
import type { Page, Seo } from "@/actions/page";

type ServicePage = Omit<Page, "seo"> & {
	seo?: Seo | null;
};

export async function getPageById(id: string): Promise<{
	success: boolean;
	page?: ServicePage;
	error?: string;
}> {
	try {
		const page = await prisma.page.findUnique({
			where: { id },
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

interface ProcessedPageData {
	content?: string;
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	type?: string;
	slug?: string;
	title?: string;
	status?: string;
	template?: { connect: { id: string } } | { disconnect: boolean };
	seo?: {
		title?: string | null | undefined;
		description?: string | null | undefined;
		keywords?: string | null | undefined;
		canonical?: string | null | undefined;
		robots?: string | null | undefined;
	};
}

export async function updatePage(
	pageId: string,
	data: Partial<Page>,
): Promise<{
	success: boolean;
	page?: ServicePage;
	error?: string;
}> {
	try {
		const { appId, templateId, ...restData } = data;
		const processedData = {
			...restData,
			content: data.content ? JSON.stringify(data.content) : undefined,
		};

		const page = await prisma.page.update({
			where: { id: pageId },
			data: processedData,
			include: {
				seo: true,
			},
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

export async function updatePageFull(
	currentPage: Page & {
		seo?: Seo | null;
	},
): Promise<{
	success: boolean;
	page?: ServicePage;
	error?: string;
}> {
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
