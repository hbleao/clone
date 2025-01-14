import { createComponent } from "@/actions/component";
import { toast } from "sonner";

interface ComponentData {
  name: string;
  type: string;
  description?: string;
  schema?: Record<string, any>;
}

interface CreateComponentResponse {
  success: boolean;
  data?: {
    id: string;
    name: string;
    type: string;
    description: string | null;
    schema: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  };
  error?: {
    message: string;
    details?: any;
  };
}

export const createComponentService = async (
  appSlug: string,
  data: ComponentData
): Promise<CreateComponentResponse> => {
  try {
    console.log("🚀 Iniciando serviço de criação de componente", { appSlug, data });

    // Validar dados obrigatórios
    if (!data.name?.trim()) {
      console.warn("❌ Nome do componente não preenchido");
      toast.error("O nome do componente é obrigatório");
      return {
        success: false,
        error: {
          message: "O nome do componente é obrigatório",
        },
      };
    }

    if (!data.type?.trim()) {
      console.warn("❌ Tipo do componente não selecionado");
      toast.error("O tipo do componente é obrigatório");
      return {
        success: false,
        error: {
          message: "O tipo do componente é obrigatório",
        },
      };
    }

    console.log("📋 Dados validados, chamando createComponent");
    const result = await createComponent(appSlug, {
      ...data,
      schema: data.schema ? { fields: data.schema } : undefined,
    });

    if (!result.success) {
      console.error("❌ Erro na criação do componente", { result });
      toast.error(
        result.error?.message || 
        "Erro desconhecido ao criar componente"
      );
      return result;
    }

    console.log("✅ Componente criado com sucesso", { componentId: result.data.id });
    toast.success("Componente criado com sucesso!");

    return {
      success: true,
      data: {
        ...result.data,
        createdAt: result.data.createdAt.toString(),
        updatedAt: result.data.updatedAt.toString(),
        schema: result.data.schema ? JSON.parse(result.data.schema) : {},
      },
    };
  } catch (error) {
    console.error("❌ Erro crítico no serviço de criação", { error });
    toast.error("Erro inesperado ao criar componente");
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
    };
  }
};
