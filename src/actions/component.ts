"use server";

import { getAppBySlug } from "./app";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { componentSchema } from "@/schemas/component";

export async function createComponent(appSlug: string, data: any) {
  try {
    console.log("🚀 Iniciando criação de componente", { appSlug, data });

    const appResult = await getAppBySlug(appSlug);
    if (!appResult.success || !appResult.app) {
      console.error("❌ Erro: Aplicativo não encontrado", { appSlug, appResult });
      return {
        success: false,
        error: appResult.error || "Aplicativo não encontrado",
      };
    }

    // Validar os dados com Zod
    const validationResult = componentSchema.safeParse(data);
    if (!validationResult.success) {
      console.error("❌ Erro de validação do componente", {
        errors: validationResult.error.errors,
        data,
      });
      return {
        success: false,
        error: validationResult.error.errors,
      };
    }

    // Converter o schema para string
    const schemaString = data.schema ? JSON.stringify(data.schema) : "{}";

    console.log("📝 Dados validados, criando componente no banco");

    // Criar o componente
    const component = await prisma.component.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description || null,
        schema: schemaString,
        app: {
          connect: {
            id: appResult.app.id,
          },
        },
      },
    });

    console.log("✅ Componente criado com sucesso", { componentId: component.id });

    // Revalidar o cache
    revalidatePath(`/apps/${appSlug}/componentes`);

    return {
      success: true,
      data: component,
    };
  } catch (error) {
    console.error("❌ Erro crítico na criação do componente", { 
      error, 
      stack: error instanceof Error ? error.stack : 'Sem stack trace' 
    });

    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Erro desconhecido",
        details: error,
      },
    };
  }
}

export async function getComponentById(id: string) {
  try {
    const component = await prisma.component.findUnique({
      where: { id },
    });

    if (!component) {
      return {
        success: false,
        error: "Componente não encontrado",
      };
    }

    // Converter o schema de volta para objeto
    const schema = component.schema
      ? JSON.parse(component.schema as string)
      : {};

    return {
      success: true,
      data: {
        ...component,
        schema,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar componente:", error);
    return {
      success: false,
      error: "Erro ao buscar componente",
    };
  }
}

export async function getComponentsByAppId(appSlug: string) {
  try {
    const app = await getAppBySlug(appSlug);
    if (!app.success || !app.app) {
      return {
        success: false,
        error: "Aplicativo não encontrado",
      };
    }

    const components = await prisma.component.findMany({
      where: { appId: app.app.id },
    });

    // Converter o schema de volta para objeto em todos os componentes
    const componentsWithParsedSchema = components.map((component) => ({
      ...component,
      schema: component.schema ? JSON.parse(component.schema as string) : {},
    }));

    return {
      success: true,
      data: componentsWithParsedSchema,
    };
  } catch (error) {
    console.error("Erro ao buscar componentes:", error);
    return {
      success: false,
      error: "Erro ao buscar componentes",
    };
  }
}

export async function updateComponent(id: string, data: any) {
  try {
    const component = await prisma.component.findUnique({
      where: { id },
    });

    if (!component) {
      return {
        success: false,
        error: "Componente não encontrado",
      };
    }

    // Validar os dados com Zod
    const validationResult = componentSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors,
      };
    }

    // Converter o schema para string
    const schemaString = data.schema ? JSON.stringify(data.schema) : "{}";

    // Atualizar o componente
    const updatedComponent = await prisma.component.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        schema: schemaString,
      },
    });

    // Revalidar o cache
    revalidatePath(`/apps/${component.appId}/componentes`);

    return {
      success: true,
      data: {
        ...updatedComponent,
        schema: data.schema,
      },
    };
  } catch (error) {
    console.error("Erro ao atualizar componente:", error);
    return {
      success: false,
      error: "Erro ao atualizar componente",
    };
  }
}

export async function deleteComponent(id: string) {
  try {
    const component = await prisma.component.findUnique({
      where: { id },
    });

    if (!component) {
      return {
        success: false,
        error: "Componente não encontrado",
      };
    }

    await prisma.component.delete({
      where: { id },
    });

    // Revalidar o cache
    revalidatePath(`/apps/${component.appId}/componentes`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erro ao excluir componente:", error);
    return {
      success: false,
      error: "Erro ao excluir componente",
    };
  }
}

export async function duplicateComponent(id: string) {
  try {
    const component = await prisma.component.findUnique({
      where: { id },
    });

    if (!component) {
      return {
        success: false,
        error: "Componente não encontrado",
      };
    }

    const duplicatedComponent = await prisma.component.create({
      data: {
        name: `${component.name} (cópia)`,
        description: component.description,
        type: component.type,
        schema: component.schema,
        appId: component.appId,
        defaultData: component.defaultData,
      },
    });

    // Revalidar o cache
    revalidatePath(`/apps/${component.appId}/componentes`);

    return {
      success: true,
      data: {
        ...duplicatedComponent,
        schema: component.schema ? JSON.parse(component.schema as string) : {},
      },
    };
  } catch (error) {
    console.error("Erro ao duplicar componente:", error);
    return {
      success: false,
      error: "Erro ao duplicar componente",
    };
  }
}
