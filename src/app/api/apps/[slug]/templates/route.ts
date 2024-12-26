import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const fieldSchema: z.ZodType<any> = z.lazy(() =>
	z.object({
		name: z.string().min(1, "Nome do campo é obrigatório"),
		type: z.string().min(1, "Tipo do campo é obrigatório"),
		label: z.string().min(1, "Label do campo é obrigatório"),
		required: z.boolean().default(false),
		fields: z.array(fieldSchema).optional(), // Para campos do tipo objeto
		arrayType: z
			.object({
				type: z.string(),
				fields: z.array(fieldSchema).optional(),
			})
			.optional(), // Para campos do tipo array
	}),
);

const sectionTemplateSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
	type: z.string().min(1, "Tipo é obrigatório"),
	description: z.string().min(1, "Descrição é obrigatória"),
	schema: z.object({
		fields: z.array(fieldSchema),
	}),
	defaultData: z.record(z.any()).optional(),
});

// GET /api/apps/[slug]/templates
export async function GET(
	request: Request,
	{ params }: { params: { slug: string } },
) {
	try {
		// Primeiro busca o app pelo slug
		const app = await prisma.app.findUnique({
			where: { slug: params.slug },
		});

		if (!app) {
			return NextResponse.json(
				{ error: "Aplicativo não encontrado" },
				{ status: 404 },
			);
		}

		const templates = await prisma.sectionTemplate.findMany({
			where: {
				appId: app.id,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(templates);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Erro ao buscar templates" },
			{ status: 500 },
		);
	}
}

// POST /api/apps/[slug]/templates
export async function POST(
	request: Request,
	{ params }: { params: { slug: string } },
) {
	try {
		// Primeiro busca o app pelo slug
		const app = await prisma.app.findUnique({
			where: { slug: params.slug },
		});

		if (!app) {
			return NextResponse.json(
				{ error: "Aplicativo não encontrado" },
				{ status: 404 },
			);
		}

		const data = await request.json();

		// Valida os dados recebidos
		const validatedData = sectionTemplateSchema.parse(data);

		// Cria o template
		const template = await prisma.sectionTemplate.create({
			data: {
				...validatedData,
				schema: JSON.stringify(validatedData.schema),
				defaultData: validatedData.defaultData
					? JSON.stringify(validatedData.defaultData)
					: null,
				appId: app.id,
			},
		});

		return NextResponse.json(template);
	} catch (error) {
		console.error("Erro ao criar template:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Erro ao criar template" },
			{ status: 500 },
		);
	}
}
