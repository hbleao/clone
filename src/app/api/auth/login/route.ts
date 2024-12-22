import { NextResponse } from "next/server";
import { authenticateUser } from "@/actions/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { registration, password } = body;

    const user = await authenticateUser({ registration, password });
    
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao fazer login" },
      { status: 401 }
    );
  }
}
