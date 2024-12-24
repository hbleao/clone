import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const sectionTemplateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.string().min(1, 'Tipo é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  schema: z.object({
    fields: z.array(z.object({
      name: z.string().min(1, 'Nome do campo é obrigatório'),
      type: z.string().min(1, 'Tipo do campo é obrigatório'),
      label: z.string().min(1, 'Label do campo é obrigatório'),
      required: z.boolean().default(false),
      options: z.array(z.any()).optional(),
    }))
  }),
  defaultData: z.record(z.any()).optional(),
});

export type SectionTemplateFormData = z.infer<typeof sectionTemplateSchema>;

export async function createSectionTemplate(appId: string, data: SectionTemplateFormData) {
  try {
    const validatedData = sectionTemplateSchema.parse(data);

    const template = await prisma.sectionTemplate.create({
      data: {
        ...validatedData,
        schema: JSON.stringify(validatedData.schema),
        defaultData: validatedData.defaultData ? JSON.stringify(validatedData.defaultData) : null,
        appId,
      },
    });

    revalidatePath(`/apps/${appId}/templates`);
    return { success: true, data: template };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    console.error('Erro ao criar template:', error);
    return { success: false, error: 'Erro ao criar template' };
  }
}

export async function updateSectionTemplate(
  appId: string,
  templateId: string,
  data: SectionTemplateFormData
) {
  try {
    const validatedData = sectionTemplateSchema.parse(data);

    const template = await prisma.sectionTemplate.update({
      where: { id: templateId },
      data: {
        ...validatedData,
        schema: JSON.stringify(validatedData.schema),
        defaultData: validatedData.defaultData ? JSON.stringify(validatedData.defaultData) : null,
      },
    });

    revalidatePath(`/apps/${appId}/templates`);
    return { success: true, data: template };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    console.error('Erro ao atualizar template:', error);
    return { success: false, error: 'Erro ao atualizar template' };
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
    console.error('Erro ao excluir template:', error);
    return { success: false, error: 'Erro ao excluir template' };
  }
}

export async function getSectionTemplate(templateId: string) {
  try {
    const template = await prisma.sectionTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return { success: false, error: 'Template não encontrado' };
    }

    return {
      success: true,
      data: {
        ...template,
        schema: JSON.parse(template.schema),
        defaultData: template.defaultData ? JSON.parse(template.defaultData) : null,
      },
    };
  } catch (error) {
    console.error('Erro ao buscar template:', error);
    return { success: false, error: 'Erro ao buscar template' };
  }
}

export async function getSectionTemplates(appId: string) {
  try {
    const templates = await prisma.sectionTemplate.findMany({
      where: { appId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: templates.map(template => ({
        ...template,
        schema: JSON.parse(template.schema),
        defaultData: template.defaultData ? JSON.parse(template.defaultData) : null,
      })),
    };
  } catch (error) {
    console.error('Erro ao buscar templates:', error);
    return { success: false, error: 'Erro ao buscar templates' };
  }
}
