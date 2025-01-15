import { create } from "zustand";
import { logger } from "@/utils";
import type { Page, Seo } from "@/actions/page";
import {
	getPageById,
	updatePage,
	updatePageFull,
} from "@/services/pageService";

interface PageWithSeo extends Page {
	seo?: Seo;
}

type PageStore = {
	currentPage: PageWithSeo | null;
	loading: boolean;
	error: string | null;

	// Actions
	fetchPage: (id: string) => Promise<void>;
	updatePage: (pageId: string, data: Partial<Page>) => Promise<void>;
	updatePageFull: (page: PageWithSeo) => Promise<void>;
	setPage: (page: PageWithSeo | null) => void;
};

export const usePageStore = create<PageStore>((set) => ({
	currentPage: null,
	loading: false,
	error: null,

	setPage: (page: PageWithSeo | null) => set({ currentPage: page }),

	fetchPage: async (id: string) => {
		set({ loading: true, error: null });
		try {
			const result = await getPageById(id);
			if (result.success && result.page) {
				set({
					currentPage: {
						...result.page,
						seo: result.page.seo
							? {
									title: result.page.seo.title,
									description: result.page.seo.description,
									keywords: result.page.seo.keywords,
									canonical: result.page.seo.canonical,
									robots: result.page.seo.robots,
								}
							: undefined,
					},
				});
			} else {
				set({ error: result.error });
			}
		} catch (error) {
			logger.error("Erro ao buscar página:", error);
			set({
				error: error instanceof Error ? error.message : "Erro desconhecido",
			});
		} finally {
			set({ loading: false });
		}
	},

	updatePage: async (pageId: string, data: Partial<Page>) => {
		set({ loading: true, error: null });
		try {
			const result = await updatePage(pageId, data);
			if (result.success && result.page) {
				set({
					currentPage: {
						...result.page,
						seo: result.page.seo
							? {
									title: result.page.seo.title,
									description: result.page.seo.description,
									keywords: result.page.seo.keywords,
									canonical: result.page.seo.canonical,
									robots: result.page.seo.robots,
								}
							: undefined,
					},
				});
			} else {
				set({ error: result.error });
			}
		} catch (error) {
			logger.error("Erro ao atualizar página:", error);
			set({
				error: error instanceof Error ? error.message : "Erro desconhecido",
			});
		} finally {
			set({ loading: false });
		}
	},

	updatePageFull: async (page: PageWithSeo) => {
		set({ loading: true, error: null });
		try {
			const result = await updatePageFull(page);
			if (result.success && result.page) {
				set({
					currentPage: {
						...result.page,
						seo: result.page.seo
							? {
									title: result.page.seo.title,
									description: result.page.seo.description,
									keywords: result.page.seo.keywords,
									canonical: result.page.seo.canonical,
									robots: result.page.seo.robots,
								}
							: undefined,
					},
				});
			} else {
				set({ error: result.error });
			}
		} catch (error) {
			logger.error("Erro ao atualizar página completa:", error);
			set({
				error: error instanceof Error ? error.message : "Erro desconhecido",
			});
		} finally {
			set({ loading: false });
		}
	},
}));
