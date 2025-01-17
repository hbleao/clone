import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { slug: string; pageId: string } },
) {
	try {
		const page = await prisma.page.findFirst({
			where: {
				id: params.pageId,
				app: {
					slug: params.slug,
				},
			},
		});

		if (!page) {
			return NextResponse.json(
				{ error: "Página não encontrada" },
				{ status: 404 },
			);
		}

		return NextResponse.json(page);
	} catch (error) {
		console.error("[GET_PAGE]", error);
		return NextResponse.json(
			{ error: "Erro ao buscar página" },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { slug: string; pageId: string } },
) {
	try {
		const data = await request.json();

		// Depois, criamos as novas seções
		const page = await prisma.page.update({
			where: {
				id: params.pageId,
				app: {
					slug: params.slug,
				},
			},
			data: {
				content: data,
			},
		});

		return NextResponse.json(page);
	} catch (error) {
		console.error("[UPDATE_PAGE]", error);
		return NextResponse.json(
			{ error: "Erro ao atualizar página" },
			{ status: 500 },
		);
	}
}
