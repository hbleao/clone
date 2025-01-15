import type { User } from "@/@types/user";

export const getUser = async (userId: string): Promise<User> => {
	// TODO: Implementar chamada API real
	return {} as User;
};

export const createUser = async (
	userData: Omit<User, "id" | "createdAt" | "updatedAt">,
): Promise<User> => {
	// TODO: Implementar chamada API real
	return {} as User;
};

export const updateUser = async (user: User): Promise<User> => {
	// TODO: Implementar chamada API real
	return {} as User;
};

export const deleteUser = async (userId: string): Promise<void> => {
	// TODO: Implementar chamada API real
};
