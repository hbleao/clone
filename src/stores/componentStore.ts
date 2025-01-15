import { create } from "zustand";
import {
	getComponentService,
	createComponentService,
	updateComponentService,
	duplicateComponentService,
	deleteComponentService,
} from "@/services/componentService";

interface ComponentState {
	currentComponent: Component | null;
	isLoading: boolean;
	error: string | null;
	loadComponent: (componentId: string) => Promise<void>;
	createComponent: (componentData: CreateComponent) => Promise<Component>;
	updateComponent: (component: Component) => Promise<void>;
	duplicateComponent: (componentId: string) => Promise<void>;
	deleteComponent: (componentId: string) => Promise<void>;
	clearComponent: () => void;
}

export const useComponentStore = create<ComponentState>((set) => ({
	currentComponent: null,
	isLoading: false,
	error: null,

	loadComponent: async (componentId) => {
		try {
			set({ isLoading: true, error: null });
			const component = await getComponentService(componentId);
			set({ currentComponent: component, isLoading: false });
		} catch (error) {
			set({ error: "Erro ao carregar componente", isLoading: false });
		}
	},

	createComponent: async (component: CreateComponent) => {
		try {
			set({ isLoading: true, error: null });
			const newComponent = await createComponentService(component);
			set({ isLoading: false });
			return newComponent;
		} catch (error) {
			set({ error: "Erro ao criar componente", isLoading: false });
			throw error;
		}
	},

	updateComponent: async (component) => {
		try {
			set({ isLoading: true, error: null });
			await updateComponentService(component);
			set({ currentComponent: component, isLoading: false });
		} catch (error) {
			set({ error: "Erro ao atualizar componente", isLoading: false });
		}
	},

	duplicateComponent: async (componentId) => {
		try {
			set({ isLoading: true, error: null });
			const duplicatedComponent = await duplicateComponentService(componentId);
			set({ currentComponent: duplicatedComponent, isLoading: false });
		} catch (error) {
			set({ error: "Erro ao duplicar componente", isLoading: false });
		}
	},

	deleteComponent: async (componentId) => {
		try {
			set({ isLoading: true, error: null });
			await deleteComponentService(componentId);
			set({ currentComponent: null, isLoading: false });
		} catch (error) {
			set({ error: "Erro ao excluir componente", isLoading: false });
		}
	},

	clearComponent: () => set({ currentComponent: null, error: null }),
}));
