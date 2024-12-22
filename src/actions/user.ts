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
		const newUser = await prisma.user.create({
			data: {
				name: data.name,
				email: data.email,
				password: data.password,
				registration: data.registration,
				role: data.role,
			},
		});
		console.log("Usuário criado:", newUser);
		return newUser;
	} catch (error) {
		console.error("Erro ao criar usuário:", error);
		throw error;
	}
}

export async function getAllUsers() {
	try {
		const users = await prisma.user.findMany();
		console.log("Todos os usuários:", users);
		return users;
	} catch (error) {
		console.error("Erro ao buscar usuários:", error);
		throw error;
	}
}

export async function getUserByEmail(email: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});
		console.log("Usuário encontrado:", user);
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
		const updatedUser = await prisma.user.update({
			where: { email },
			data,
		});
		console.log("Usuário atualizado:", updatedUser);
		return updatedUser;
	} catch (error) {
		console.error("Erro ao atualizar usuário:", error);
		throw error;
	}
}

export async function deleteUser(email: string) {
	try {
		const deletedUser = await prisma.user.delete({
			where: { email },
		});
		console.log("Usuário deletado:", deletedUser);
		return deletedUser;
	} catch (error) {
		console.error("Erro ao deletar usuário:", error);
		throw error;
	}
}
