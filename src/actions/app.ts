"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { generateSlug } from "@/utils";

interface CreateAppData {
	name: string;
	description?: string;
	owner: string;
	userId: string;
}

interface UpdateAppData {
	name?: string;
	description?: string;
	owner?: string;
}

export async function createApp(data: CreateAppData) {
	try {
		let slug = generateSlug(data.name);
		let counter = 0;

		// Verifica se o slug já existe e adiciona um número se necessário
		while (true) {
			const existingApp = await prisma.app.findUnique({
				where: { slug: counter === 0 ? slug : `${slug}-${counter}` },
			});

			if (!existingApp) {
				slug = counter === 0 ? slug : `${slug}-${counter}`;
				break;
			}

			counter++;
		}

		const app = await prisma.app.create({
			data: {
				name: data.name,
				title: data.name,
				slug,
				description: data.description,
				owner: data.owner,
				userId: data.userId,
			},
		});

		revalidatePath("/meus-aplicativos");
		return { app };
	} catch (error) {
		return { error: "Erro ao criar o app" };
	}
}

// Buscar todos os apps
export async function getAllApps() {
	try {
		const apps = await prisma.app.findMany({
			include: {
				user: true,
			},
		});
		return { apps };
	} catch (error) {
		return { error: "Erro ao buscar os apps" };
	}
}

// Buscar app por slug
export async function getAppBySlug(slug: string) {
	try {
		const app = await prisma.app.findUnique({
			where: { slug },
			include: {
				user: true,
			},
		});

		if (!app) {
			return { success: false, error: "Aplicativo não encontrado" };
		}

		return { success: true, app };
	} catch (error) {
		return { success: false, error: "Erro ao buscar o app" };
	}
}

// Atualizar um app
export async function updateApp(id: string, data: UpdateAppData) {
	try {
		const updateData: any = { ...data };

		// Se o nome foi atualizado, gera um novo slug
		if (data.name) {
			let slug = generateSlug(data.name);
			let counter = 0;

			while (true) {
				const existingApp = await prisma.app.findFirst({
					where: {
						slug: counter === 0 ? slug : `${slug}-${counter}`,
						id: { not: id }, // Ignora o app atual
					},
				});

				if (!existingApp) {
					slug = counter === 0 ? slug : `${slug}-${counter}`;
					break;
				}

				counter++;
			}

			updateData.slug = slug;
		}

		const app = await prisma.app.update({
			where: { id },
			data: updateData,
		});

		revalidatePath("/meus-aplicativos");
		return { app };
	} catch (error) {
		return { error: "Erro ao atualizar o app" };
	}
}

// Deletar um app
export async function deleteApp(id: string) {
	try {
		await prisma.app.delete({
			where: { id },
		});

		revalidatePath("/meus-aplicativos");
		return { success: true };
	} catch (error) {
		return { error: "Erro ao deletar o app" };
	}
}
