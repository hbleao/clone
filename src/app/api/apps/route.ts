import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const apps = await prisma.app.findMany({
      select: {
        id: true,
        title: true,
        name: true,
      },
    });

    return NextResponse.json(apps);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar aplicações" },
      { status: 500 }
    );
  }
}
