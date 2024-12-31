import { type NextRequest, NextResponse } from "next/server";
import {
	checkResourcePermission,
	type PermissionAction,
} from "@/lib/permitions";
import { getUserFromToken } from "@/lib/permitions";

export async function POST(
	request: NextRequest,
	{ params }: { params: { resourceId: string } },
) {
	// Obter token do cabeçalho de autorização
	const token = request.headers.get("authorization")?.replace("Bearer ", "");

	if (!token) {
		return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
	}

	// Verificar usuário pelo token
	const user = await getUserFromToken(token);

	if (!user) {
		return NextResponse.json(
			{ error: "Usuário não autenticado" },
			{ status: 401 },
		);
	}

	const { action } = await request.json();

	try {
		const canPerformAction = await checkResourcePermission(
			user.id,
			params.resourceId,
			action as PermissionAction,
		);

		return NextResponse.json({
			canView: canPerformAction,
			canEdit: canPerformAction,
			canDelete: canPerformAction,
		});
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 403 });
	}
}
