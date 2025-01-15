import { create } from "zustand";
import type { User } from "@/@types/user";
import {
	getUser,
	createUser,
	updateUser,
	deleteUser,
} from "@/services/userService";

interface UserState {
	currentUser: User | null;
	isLoading: boolean;
	error: string | null;
	loadUser: (userId: string) => Promise<void>;
	createUser: (
		userData: Omit<User, "id" | "createdAt" | "updatedAt">,
	) => Promise<User>;
	updateUser: (user: User) => Promise<void>;
	deleteUser: (userId: string) => Promise<void>;
	clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
	currentUser: null,
	isLoading: false,
	error: null,

	loadUser: async (userId) => {
		try {
			set({ isLoading: true, error: null });
			const user = await getUser(userId);
			set({ currentUser: user, isLoading: false });
		} catch (error) {
			set({ error: "Erro ao carregar usuário", isLoading: false });
		}
	},

	createUser: async (userData) => {
		try {
			set({ isLoading: true, error: null });
			const newUser = await createUser(userData);
			set({ isLoading: false });
			return newUser;
		} catch (error) {
			set({ error: "Erro ao criar usuário", isLoading: false });
			throw error;
		}
	},

	updateUser: async (user) => {
		try {
			set({ isLoading: true, error: null });
			const updatedUser = await updateUser(user);
			set({ currentUser: updatedUser, isLoading: false });
		} catch (error) {
			set({ error: "Erro ao atualizar usuário", isLoading: false });
		}
	},

	deleteUser: async (userId) => {
		try {
			set({ isLoading: true, error: null });
			await deleteUser(userId);
			set({ currentUser: null, isLoading: false });
		} catch (error) {
			set({ error: "Erro ao excluir usuário", isLoading: false });
		}
	},

	clearUser: () => set({ currentUser: null, error: null }),
}));
