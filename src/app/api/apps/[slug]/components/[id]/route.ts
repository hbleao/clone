import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
		const app = await prisma.app.findUnique({
			where: { slug: params.slug },
		});

		if (!app) {
			return NextResponse.json(
				{ error: "Aplicativo não encontrado" },
				{ status: 404 },
			);
		}

		const template = await prisma.pageTemplate.findFirst({
			where: {
				id: params.id,
				appId: app.id,
			},
			include: {
				components: {
					include: {
						component: true,
					},
				},
			},
		});

		if (!template) {
			return NextResponse.json(
				{ error: "Template não encontrado" },
				{ status: 404 },
			);
		}

		return NextResponse.json(template);
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
		const app = await prisma.app.findUnique({
			where: { slug: params.slug },
		});

		if (!app) {
			return NextResponse.json(
				{ error: "Aplicativo não encontrado" },
				{ status: 404 },
			);
		}

		const template = await prisma.pageTemplate.findFirst({
			where: {
				id: params.id,
				appId: app.id,
			},
		});

		if (!template) {
			return NextResponse.json(
				{ error: "Template não encontrado" },
				{ status: 404 },
			);
		}

		const body = await request.json();
		const { name, description, components } = templateSchema.parse(body);

		// Primeiro remove todos os componentes existentes
		await prisma.pageTemplateComponent.deleteMany({
			where: {
				templateId: template.id,
			},
		});

		// Atualiza o template e cria os novos componentes
		const updatedTemplate = await prisma.pageTemplate.update({
			where: {
				id: template.id,
			},
			data: {
				name,
				description,
				components: {
					create: components.map((component) => ({
						componentId: component.componentId,
						position: component.position,
						initialData: component.initialData
							? JSON.stringify(component.initialData)
							: null,
					})),
				},
			},
			include: {
				components: {
					include: {
						component: true,
					},
				},
			},
		});

		return NextResponse.json(updatedTemplate);
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
		const app = await prisma.app.findUnique({
			where: { slug: params.slug },
		});

		if (!app) {
			return NextResponse.json(
				{ error: "Aplicativo não encontrado" },
				{ status: 404 },
			);
		}

		const template = await prisma.pageTemplate.findFirst({
			where: {
				id: params.id,
				appId: app.id,
			},
		});

		if (!template) {
			return NextResponse.json(
				{ error: "Template não encontrado" },
				{ status: 404 },
			);
		}

		// Primeiro remove todos os componentes
		await prisma.pageTemplateComponent.deleteMany({
			where: {
				templateId: template.id,
			},
		});

		// Depois remove o template
		await prisma.pageTemplate.delete({
			where: {
				id: template.id,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Erro ao excluir template" },
			{ status: 500 },
		);
	}
}
