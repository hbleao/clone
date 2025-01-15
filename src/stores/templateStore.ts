import { create } from "zustand";
import type { Template } from "@/@types/template";
import {
	getTemplate,
	createTemplate,
	updateTemplate,
	deleteTemplate,
} from "@/services/templateService";

interface TemplateState {
	currentTemplate: Template | null;
	isLoading: boolean;
	error: string | null;
	loadTemplate: (templateId: string) => Promise<void>;
	createTemplate: (
		templateData: Omit<Template, "id" | "createdAt" | "updatedAt">,
	) => Promise<Template>;
	updateTemplate: (template: Template) => Promise<void>;
	deleteTemplate: (templateId: string) => Promise<void>;
	clearTemplate: () => void;
}

export const useTemplateStore = create<TemplateState>((set) => ({
	currentTemplate: null,
	isLoading: false,
	error: null,

	loadTemplate: async (templateId) => {
		try {
			set({ isLoading: true, error: null });
			const template = await getTemplate(templateId);
			set({ currentTemplate: template, isLoading: false });
		} catch (error) {
			set({ error: "Erro ao carregar template", isLoading: false });
		}
	},

	createTemplate: async (templateData) => {
		try {
			set({ isLoading: true, error: null });
			const newTemplate = await createTemplate(templateData);
			set({ isLoading: false });
			return newTemplate;
		} catch (error) {
			set({ error: "Erro ao criar template", isLoading: false });
			throw error;
		}
	},

	updateTemplate: async (template) => {
		try {
			set({ isLoading: true, error: null });
			const updatedTemplate = await updateTemplate(template);
			set({ currentTemplate: updatedTemplate, isLoading: false });
		} catch (error) {
			set({ error: "Erro ao atualizar template", isLoading: false });
		}
	},

	deleteTemplate: async (templateId) => {
		try {
			set({ isLoading: true, error: null });
			await deleteTemplate(templateId);
			set({ currentTemplate: null, isLoading: false });
		} catch (error) {
			set({ error: "Erro ao excluir template", isLoading: false });
		}
	},

	clearTemplate: () => set({ currentTemplate: null, error: null }),
}));
