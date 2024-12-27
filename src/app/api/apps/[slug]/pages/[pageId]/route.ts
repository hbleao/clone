import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
			include: {
				sections: {
					include: {
						template: true,
					},
					orderBy: {
						order: "asc",
					},
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

		// Primeiro, excluímos todas as seções existentes
		await prisma.pageSection.deleteMany({
			where: {
				pageId: params.pageId,
			},
		});

		// Depois, criamos as novas seções
		const page = await prisma.page.update({
			where: {
				id: params.pageId,
				app: {
					slug: params.slug,
				},
			},
			data: {
				sections: {
					create: data.sections.map((section: any) => ({
						id: section.id,
						templateId: section.templateId,
						data: section.data,
						order: section.order,
					})),
				},
			},
			include: {
				sections: {
					include: {
						template: true,
					},
					orderBy: {
						order: "asc",
					},
				},
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
