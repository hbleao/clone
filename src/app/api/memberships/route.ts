import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppRole } from "@/lib/permitions";

export async function GET() {
  try {
    const memberships = await prisma.appMembership.findMany({
      include: {
        user: true,
        app: true,
      },
    });

    return NextResponse.json(memberships);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar permissões" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, appId, role } = await request.json();

    // Verificar se já existe uma permissão para este usuário e app
    const existingMembership = await prisma.appMembership.findUnique({
      where: {
        userId_appId: {
          userId,
          appId,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "Usuário já possui permissão nesta aplicação" },
        { status: 400 }
      );
    }

    const membership = await prisma.appMembership.create({
      data: {
        userId,
        appId,
        role,
      },
      include: {
        user: true,
        app: true,
      },
    });

    return NextResponse.json(membership);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar permissão" },
      { status: 500 }
    );
  }
}
