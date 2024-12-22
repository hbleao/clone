import { prisma } from "../lib/prisma";

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

		// Remove a senha do objeto retornado por segurança
		const { password, ...userWithoutPassword } = user;
		return userWithoutPassword;
	} catch (error) {
		console.error("Erro na autenticação:", error);
		throw error;
	}
}

export async function validateSession() {
	// TODO: Implementar validação de sessão quando necessário
	return null;
}
