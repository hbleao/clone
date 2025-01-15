import {
	createComponent as createComponentAction,
	getComponentById,
	updateComponent as updateComponentAction,
	deleteComponent as deleteComponentAction,
	duplicateComponent as duplicateComponentAction,
} from "@/actions/component";

export const getComponentService = async (
	componentId: string,
): Promise<Component> => {
	const result = await getComponentById(componentId);
	if (!result.success || !result.data)
		throw new Error("Componente não encontrado");
	return {
		...result.data,
		slug: result.data.name,
	};
};

export const createComponentService = async ({
	appSlug,
	...component
}: CreateComponent): Promise<Component> => {
	const result = await createComponentAction(appSlug, { ...component });
	if (!result.success || !result.data)
		throw new Error("Erro ao criar componente");
	return {
		...result.data,
		slug: result.data.name.toLowerCase().replace(/\s+/g, "-"),
	};
};

export const updateComponentService = async (
	component: Component,
): Promise<Component> => {
	const result = await updateComponentAction(component.id, {
		...component,
		slug: component.name.toLowerCase().replace(/\s+/g, "-"),
	});
	if (!result.success || !result.data)
		throw new Error("Erro ao atualizar componente");
	return {
		...result.data,
		slug: result.data.name.toLowerCase().replace(/\s+/g, "-"),
	};
};

export const duplicateComponentService = async (
	componentId: string,
): Promise<Component> => {
	const result = await duplicateComponentAction(componentId);
	if (!result.success || !result.data)
		throw new Error("Erro ao duplicar componente");
	return {
		...result.data,
		slug: result.data.name.toLowerCase().replace(/\s+/g, "-"),
	};
};

export const deleteComponentService = async (
	componentId: string,
): Promise<void> => {
	const result = await deleteComponentAction(componentId);
	if (!result.success) throw new Error("Erro ao excluir componente");
};
