import { NextResponse } from "next/server";
import { getAppBySlug } from "@/actions/app";
import {
  createComponent,
  getComponentsByAppId,
  updateComponent,
  deleteComponent,
} from "@/actions/component";

// GET /api/apps/[slug]/components
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const app = await getAppBySlug(params.slug);
    if (!app.app) {
      return NextResponse.json(
        { error: "Aplicativo não encontrado" },
        { status: 404 }
      );
    }

    const result = await getComponentsByAppId(app.app.id);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar componentes" },
      { status: 500 }
    );
  }
}

// POST /api/apps/[slug]/components
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const app = await getAppBySlug(params.slug);
    if (!app.app) {
      return NextResponse.json(
        { error: "Aplicativo não encontrado" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const result = await createComponent(app.app.id, body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar componente" },
      { status: 500 }
    );
  }
}

// PUT /api/apps/[slug]/components/[id]
export async function PUT(
  request: Request,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const app = await getAppBySlug(params.slug);
    if (!app.app) {
      return NextResponse.json(
        { error: "Aplicativo não encontrado" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const result = await updateComponent(params.id, body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar componente" },
      { status: 500 }
    );
  }
}

// DELETE /api/apps/[slug]/components/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const app = await getAppBySlug(params.slug);
    if (!app.app) {
      return NextResponse.json(
        { error: "Aplicativo não encontrado" },
        { status: 404 }
      );
    }

    const result = await deleteComponent(params.id);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao deletar componente" },
      { status: 500 }
    );
  }
}
