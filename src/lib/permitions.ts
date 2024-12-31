import { prisma } from "@/lib/prisma";

export enum PermissionAction {
	VIEW = "view",
	EDIT = "edit",
	DELETE = "delete",
}

export enum AppRole {
	VIEWER = "VIEWER",
	EDITOR = "EDITOR",
	ADMIN = "ADMIN",
	OWNER = "OWNER",
}

export async function checkResourcePermission(
	userId: string,
	resourceId: string,
	action: PermissionAction,
) {
	// Buscar o recurso (pode ser Page, App, etc.)
	const resource = await prisma.page.findUnique({
		where: { id: resourceId },
		include: {
			app: {
				include: {
					AppMembership: {
						where: { userId },
					},
				},
			},
		},
	});

	if (!resource) {
		throw new Error("Recurso não encontrado");
	}

	const membership = resource.app.AppMembership[0];

	// Hierarquia de permissões
	const rolePermissions = {
		[AppRole.VIEWER]: [PermissionAction.VIEW],
		[AppRole.EDITOR]: [PermissionAction.VIEW, PermissionAction.EDIT],
		[AppRole.ADMIN]: [
			PermissionAction.VIEW,
			PermissionAction.EDIT,
			PermissionAction.DELETE,
		],
		[AppRole.OWNER]: [
			PermissionAction.VIEW,
			PermissionAction.EDIT,
			PermissionAction.DELETE,
		],
	};

	// Verificações de permissão
	const userRole = membership?.role || AppRole.VIEWER;
	const allowedActions = rolePermissions[userRole];

	return allowedActions.includes(action);
}

export async function getUserFromToken(token: string) {
	try {
		// Implementar verificação de token
		const user = await prisma.user.findFirst({
			where: {
				// Adicionar lógica de verificação de token
				// Por exemplo, verificar em uma tabela de tokens ativos
			},
		});

		return user;
	} catch (error) {
		console.error("Erro ao verificar usuário:", error);
		return null;
	}
}
