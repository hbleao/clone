"use server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/utils/logger";

export async function createUser(data: {
	name: string;
	email: string;
	registration: string;
	password: string;
	role?: string;
}) {
	try {
		logger.info("Criando usuário:", {
			email: data.email,
			registration: data.registration,
		});
		const newUser = await prisma.user.create({
			data: {
				name: data.name,
				email: data.email,
				password: data.password,
				registration: data.registration,
				role: data.role,
			},
		});
		logger.info("Usuário criado com sucesso:", newUser);
		return newUser;
	} catch (error) {
		logger.error("Erro ao criar usuário:", error);
		throw error;
	}
}

export async function getAllUsers() {
	try {
		logger.info("Buscando todos os usuários");
		const users = await prisma.user.findMany();
		logger.info("Usuários encontrados:", users);
		return users;
	} catch (error) {
		logger.error("Erro ao buscar usuários:", error);
		throw error;
	}
}

export async function getUserByEmail(email: string) {
	try {
		logger.info("Buscando usuário pelo email:", email);
		const user = await prisma.user.findUnique({
			where: { email },
		});
		if (!user) {
			logger.warn("Usuário não encontrado:", email);
		}
		return user;
	} catch (error) {
		logger.error("Erro ao buscar usuário:", error);
		throw error;
	}
}

export async function updateUser(
	email: string,
	data: { name?: string; registration?: string; role?: string },
) {
	try {
		logger.info("Atualizando usuário:", { email, data });
		const updatedUser = await prisma.user.update({
			where: { email },
			data,
		});
		logger.info("Usuário atualizado com sucesso:", updatedUser);
		return updatedUser;
	} catch (error) {
		logger.error("Erro ao atualizar usuário:", error);
		throw error;
	}
}

export async function deleteUser(email: string) {
	try {
		logger.info("Deletando usuário:", email);
		const deletedUser = await prisma.user.delete({
			where: { email },
		});
		logger.info("Usuário deletado com sucesso:", deletedUser);
		return deletedUser;
	} catch (error) {
		logger.error("Erro ao deletar usuário:", error);
		throw error;
	}
}
