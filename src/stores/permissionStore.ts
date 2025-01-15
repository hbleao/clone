import { create } from "zustand";
import type { Permission } from "@/@types/permission";
import {
	getPermission,
	createPermission,
	updatePermission,
	deletePermission,
} from "@/services/permissionService";

interface PermissionState {
	currentPermission: Permission | null;
	isLoading: boolean;
	error: string | null;
	loadPermission: (permissionId: string) => Promise<void>;
	createPermission: (
		permissionData: Omit<Permission, "id" | "createdAt" | "updatedAt">,
	) => Promise<Permission>;
	updatePermission: (permission: Permission) => Promise<void>;
	deletePermission: (permissionId: string) => Promise<void>;
	clearPermission: () => void;
}

export const usePermissionStore = create<PermissionState>((set) => ({
	currentPermission: null,
	isLoading: false,
	error: null,

	loadPermission: async (permissionId) => {
		try {
			set({ isLoading: true, error: null });
			const permission = await getPermission(permissionId);
			set({ currentPermission: permission, isLoading: false });
		} catch (error) {
			set({ error: "Erro ao carregar permissão", isLoading: false });
		}
	},

	createPermission: async (permissionData) => {
		try {
			set({ isLoading: true, error: null });
			const newPermission = await createPermission(permissionData);
			set({ isLoading: false });
			return newPermission;
		} catch (error) {
			set({ error: "Erro ao criar permissão", isLoading: false });
			throw error;
		}
	},

	updatePermission: async (permission) => {
		try {
			set({ isLoading: true, error: null });
			const updatedPermission = await updatePermission(permission);
			set({ currentPermission: updatedPermission, isLoading: false });
		} catch (error) {
			set({ error: "Erro ao atualizar permissão", isLoading: false });
		}
	},

	deletePermission: async (permissionId) => {
		try {
			set({ isLoading: true, error: null });
			await deletePermission(permissionId);
			set({ currentPermission: null, isLoading: false });
		} catch (error) {
			set({ error: "Erro ao excluir permissão", isLoading: false });
		}
	},

	clearPermission: () => set({ currentPermission: null, error: null }),
}));
