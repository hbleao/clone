import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type SectionTemplateFormData = {
	name: string;
	type: string;
	description: string;
	schema: string;
	defaultData: string;
};

function validateFields(data: SectionTemplateFormData): {
	success: boolean;
	error: [
		{
			message: string;
		},
	];
} {
	if (!data.name || data.name.trim() === "") {
		return { success: false, error: [{ message: "Nome é obrigatório" }] };
	}

	if (!data.type || data.type.trim() === "") {
		return { success: false, error: [{ message: "Tipo é obrigatório" }] };
	}

	if (!data.description || data.description.trim() === "") {
		return {
			success: false,
			error: [{ message: "Descrição é obrigatória" }],
		};
	}

	if (!data.schema) {
		return { success: false, error: [{ message: "Schema inválido" }] };
	}

	return {
		success: true,
		error: [{ message: "" }],
	};
}

export async function createSectionTemplate(
	appId: string,
	data: SectionTemplateFormData,
) {
	const validData = validateFields(data);

	if (!validData?.success) {
		return { success: false, error: validData.error };
	}

	try {
		const template = await prisma.sectionTemplate.create({
			data: {
				...data,
				schema: data.schema,
				defaultData: data.defaultData ? JSON.stringify(data.defaultData) : null,
				appId,
			},
		});

		revalidatePath(`/apps/${appId}/templates`);
		return { success: true, data: template };
	} catch (error) {
		return { success: false, error: "Erro ao criar template" };
	}
}

export async function updateSectionTemplate(
	appId: string,
	templateId: string,
	data: SectionTemplateFormData,
) {
	try {
		const template = await prisma.sectionTemplate.update({
			where: { id: templateId },
			data: {
				...data,
				schema: JSON.stringify(data.schema),
				defaultData: data.defaultData ? JSON.stringify(data.defaultData) : null,
			},
		});

		revalidatePath(`/apps/${appId}/templates`);
		return { success: true, data: template };
	} catch (error) {
		return { success: false, error: "Erro ao atualizar template" };
	}
}

export async function deleteSectionTemplate(appId: string, templateId: string) {
	try {
		await prisma.sectionTemplate.delete({
			where: { id: templateId },
		});
		revalidatePath(`/apps/${appId}/templates`);
		return { success: true };
	} catch (error) {
		return { success: false, error: "Erro ao excluir template" };
	}
}

export async function getSectionTemplateById(templateId: string) {
	try {
		const template = await prisma.sectionTemplate.findUnique({
			where: { id: templateId },
		});

		if (!template) {
			return { success: false, error: "Template não encontrado" };
		}

		return {
			success: true,
			data: {
				...template,
				schema: JSON.parse(template.schema),
				defaultData: template.defaultData
					? JSON.parse(template.defaultData)
					: null,
			},
		};
	} catch (error) {
		return { success: false, error: "Erro ao buscar template" };
	}
}

export async function getSectionTemplates(appId: string) {
	try {
		const templates = await prisma.sectionTemplate.findMany({
			where: { appId },
			orderBy: { createdAt: "desc" },
		});

		return {
			success: true,
			data: templates.map((template) => ({
				...template,
				schema: JSON.parse(template.schema),
				defaultData: template.defaultData
					? JSON.parse(template.defaultData)
					: null,
			})),
		};
	} catch (error) {
		return { success: false, error: "Erro ao buscar templates" };
	}
}
