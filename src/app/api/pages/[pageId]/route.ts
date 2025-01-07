import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { pageId: string } }
) {
  try {
    const page = await prisma.page.findFirst({
      where: {
        id: params.pageId,
      },
      include: {
        seo: true,
      },
    });

    if (!page) {
      return NextResponse.json(
        { error: "Página não encontrada" },
        { status: 404 }
      );
    }

    // Tenta parsear o conteúdo se for uma string
    let parsedContent = page.content;
    if (typeof page.content === "string" && page.content.trim().startsWith("{")) {
      try {
        parsedContent = JSON.parse(page.content);
      } catch (parseError) {
        console.error("Erro ao parsear conteúdo:", parseError);
        // Em caso de erro de parsing, mantém o conteúdo original
        parsedContent = page.content;
      }
    }

    return NextResponse.json({
      ...page,
      content: parsedContent,
    });
  } catch (error) {
    console.error("Erro ao buscar página:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
