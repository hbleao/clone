"use server";
import { prisma } from "@/lib/prisma";

export async function createUser(data: {
	name: string;
	email: string;
	registration: string;
	password: string;
	role?: string;
}) {
	try {
		console.info("Criando usuário:", {
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
		console.info("Usuário criado com sucesso:", newUser);
		return newUser;
	} catch (error) {
		console.error("Erro ao criar usuário:", error);
		throw error;
	}
}

export async function getAllUsers() {
	try {
		console.info("Buscando todos os usuários");
		const users = await prisma.user.findMany();
		console.info("Usuários encontrados:", users);
		return users;
	} catch (error) {
		console.error("Erro ao buscar usuários:", error);
		throw error;
	}
}

export async function getUserByEmail(email: string) {
	try {
		console.info("Buscando usuário pelo email:", email);
		const user = await prisma.user.findUnique({
			where: { email },
		});
		if (!user) {
			console.warn("Usuário não encontrado:", email);
		}
		return user;
	} catch (error) {
		console.error("Erro ao buscar usuário:", error);
		throw error;
	}
}

export async function updateUser(
	email: string,
	data: { name?: string; registration?: string; role?: string },
) {
	try {
		console.info("Atualizando usuário:", { email, data });
		const updatedUser = await prisma.user.update({
			where: { email },
			data,
		});
		console.info("Usuário atualizado com sucesso:", updatedUser);
		return updatedUser;
	} catch (error) {
		console.error("Erro ao atualizar usuário:", error);
		throw error;
	}
}

export async function deleteUser(email: string) {
	try {
		console.info("Deletando usuário:", email);
		const deletedUser = await prisma.user.delete({
			where: { email },
		});
		console.info("Usuário deletado com sucesso:", deletedUser);
		return deletedUser;
	} catch (error) {
		console.error("Erro ao deletar usuário:", error);
		throw error;
	}
}
