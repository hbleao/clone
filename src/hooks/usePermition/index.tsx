"use client";
import { useState, useEffect } from "react";
import { PermissionAction } from "@/lib/permitions";

interface PermissionHook {
	canView: boolean;
	canEdit: boolean;
	canDelete: boolean;
	isLoading: boolean;
	error: string | null;
}

export function usePermission(
	resourceId: string,
	requiredAction: PermissionAction = PermissionAction.VIEW,
): PermissionHook {
	const [permissions, setPermissions] = useState<PermissionHook>({
		canView: false,
		canEdit: false,
		canDelete: false,
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		async function checkPermissions() {
			try {
				// Obter token de autenticação (implementar método de obtenção)
				const token = localStorage.getItem("authToken");

				if (!token) {
					throw new Error("Usuário não autenticado");
				}

				const response = await fetch(`/api/permissions/${resourceId}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ action: requiredAction }),
				});

				const data = await response.json();

				setPermissions({
					canView: data.canView,
					canEdit: data.canEdit,
					canDelete: data.canDelete,
					isLoading: false,
					error: null,
				});
			} catch (error) {
				setPermissions({
					canView: false,
					canEdit: false,
					canDelete: false,
					isLoading: false,
					error: error.message,
				});
			}
		}

		checkPermissions();
	}, [resourceId, requiredAction]);

	return permissions;
}

// Exemplo de uso
export function PageComponent({ pageId }) {
	const { canEdit, canDelete, isLoading } = usePermission(
		pageId,
		PermissionAction.EDIT,
	);

	if (isLoading) return <div>Carregando...</div>;

	return (
		<div>
			{canEdit && <button>Editar</button>}
			{canDelete && <button>Excluir</button>}
		</div>
	);
}
