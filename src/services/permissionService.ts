import type { Permission } from "@/@types/permission";

export const getPermission = async (
	permissionId: string,
): Promise<Permission> => {
	// TODO: Implementar chamada API real
	return {} as Permission;
};

export const createPermission = async (
	permissionData: Omit<Permission, "id" | "createdAt" | "updatedAt">,
): Promise<Permission> => {
	// TODO: Implementar chamada API real
	return {} as Permission;
};

export const updatePermission = async (
	permission: Permission,
): Promise<Permission> => {
	// TODO: Implementar chamada API real
	return {} as Permission;
};

export const deletePermission = async (permissionId: string): Promise<void> => {
	// TODO: Implementar chamada API real
};
