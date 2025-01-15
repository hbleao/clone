import type { Template } from "@/@types/template";

export const getTemplate = async (templateId: string): Promise<Template> => {
	// TODO: Implementar chamada API real
	return {} as Template;
};

export const createTemplate = async (
	templateData: Omit<Template, "id" | "createdAt" | "updatedAt">,
): Promise<Template> => {
	// TODO: Implementar chamada API real
	return {} as Template;
};

export const updateTemplate = async (template: Template): Promise<Template> => {
	// TODO: Implementar chamada API real
	return {} as Template;
};

export const deleteTemplate = async (templateId: string): Promise<void> => {
	// TODO: Implementar chamada API real
};
