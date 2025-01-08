import { NextResponse } from "next/server";
import { getAppBySlug } from "@/actions/app";
import { getComponentById, updateComponent, deleteComponent } from "@/actions/component";
import { z } from "zod";

const templateSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
	description: z.string().min(1, "Descrição é obrigatória"),
	components: z.array(
		z.object({
			id: z.string().optional(),
			componentId: z.string(),
			position: z.number(),
			initialData: z.record(z.any()).optional(),
		}),
	),
});

// GET /api/apps/[slug]/templates/[id]
export async function GET(
	request: Request,
	{ params }: { params: { slug: string; id: string } },
) {
	try {
		const app = await getAppBySlug(params.slug);
		if (!app.app) {
			return NextResponse.json(
				{ error: "Aplicativo não encontrado" },
				{ status: 404 },
			);
		}

		const result = await getComponentById(params.id);
		if (!result.success) {
			return NextResponse.json(
				{ error: result.error },
				{ status: 404 },
			);
		}

		return NextResponse.json(result.data);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Erro ao buscar template" },
			{ status: 500 },
		);
	}
}

// PUT /api/apps/[slug]/templates/[id]
export async function PUT(
	request: Request,
	{ params }: { params: { slug: string; id: string } },
) {
	try {
		const app = await getAppBySlug(params.slug);
		if (!app.app) {
			return NextResponse.json(
				{ error: "Aplicativo não encontrado" },
				{ status: 404 },
			);
		}

		const body = await request.json();
		const { name, description, components } = templateSchema.parse(body);

		const result = await updateComponent(params.id, {
			name,
			description,
			components,
		});

		if (!result.success) {
			return NextResponse.json(
				{ error: result.error },
				{ status: 400 },
			);
		}

		return NextResponse.json(result.data);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Dados inválidos", details: error.errors },
				{ status: 400 },
			);
		}

		console.error(error);
		return NextResponse.json(
			{ error: "Erro ao atualizar template" },
			{ status: 500 },
		);
	}
}

// DELETE /api/apps/[slug]/templates/[id]
export async function DELETE(
	request: Request,
	{ params }: { params: { slug: string; id: string } },
) {
	try {
		const app = await getAppBySlug(params.slug);
		if (!app.app) {
			return NextResponse.json(
				{ error: "Aplicativo não encontrado" },
				{ status: 404 },
			);
		}

		const result = await deleteComponent(params.id);
		if (!result.success) {
			return NextResponse.json(
				{ error: result.error },
				{ status: 400 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Erro ao excluir template" },
			{ status: 500 },
		);
	}
}
