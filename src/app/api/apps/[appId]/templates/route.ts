import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/apps/[slug]/templates
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Primeiro busca o app pelo slug
    const app = await prisma.app.findUnique({
      where: { slug: params.slug },
    });

    if (!app) {
      return NextResponse.json({ error: 'Aplicativo não encontrado' }, { status: 404 });
    }

    const templates = await prisma.sectionTemplate.findMany({
      where: {
        appId: app.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erro ao buscar templates' },
      { status: 500 }
    );
  }
}

// POST /api/apps/[slug]/templates
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Primeiro busca o app pelo slug
    const app = await prisma.app.findUnique({
      where: { slug: params.slug },
    });

    if (!app) {
      return NextResponse.json({ error: 'Aplicativo não encontrado' }, { status: 404 });
    }

    const json = await request.json();
    const { name, type, description, schema, thumbnail } = json;

    const template = await prisma.sectionTemplate.create({
      data: {
        name,
        type,
        description,
        schema: JSON.stringify(schema),
        thumbnail,
        appId: app.id,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erro ao criar template' },
      { status: 500 }
    );
  }
}
