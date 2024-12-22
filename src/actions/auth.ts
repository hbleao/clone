"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from 'next/headers';

export async function authenticateUser(credentials: {
	registration: string;
	password: string;
}) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				registration: credentials.registration,
			},
		});

		if (!user) {
			throw new Error("Usuário não encontrado");
		}

		// TODO: Adicionar hash de senha posteriormente
		if (user.password !== credentials.password) {
			throw new Error("Senha incorreta");
		}

		// Salva o registration nos cookies
		cookies().set('user_registration', user.registration, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
		});

		// Remove a senha do objeto retornado por segurança
		const { password, ...userWithoutPassword } = user;
		return userWithoutPassword;
	} catch (error) {
		console.error("Erro na autenticação:", error);
		throw error;
	}
}

export async function getCurrentUser() {
  try {
    const registration = cookies().get('user_registration')?.value;
    
    if (!registration) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        registration,
      },
    });

    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error);
    return null;
  }
}

export async function validateSession() {
	// TODO: Implementar validação de sessão quando necessário
	return null;
}
