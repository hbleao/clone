import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const passwordSchema = z
	.string()
	.min(8, "A senha deve ter no mínimo 8 caracteres")
	.regex(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
		"A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial",
	);

export const userSchema = z
	.object({
		name: z.string().min(1, "O nome é obrigatório"),
		email: z.string().email("Email inválido"),
		registration: z.string().min(1, "A matrícula é obrigatória"),
		role: z.enum(["ADMIN", "EDITOR", "AUTHOR"]),
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não conferem",
		path: ["confirmPassword"],
	});

export const userEditSchema = z
	.object({
		name: z.string().min(1, "O nome é obrigatório"),
		email: z.string().email("Email inválido"),
		registration: z.string().min(1, "A matrícula é obrigatória"),
		role: z.enum(["ADMIN", "EDITOR", "AUTHOR"]),
		password: passwordSchema.optional(),
		confirmPassword: z.string().optional(),
	})
	.refine(
		(data) => {
			if (data.password && data.confirmPassword) {
				return data.password === data.confirmPassword;
			}
			return true;
		},
		{
			message: "As senhas não conferem",
			path: ["confirmPassword"],
		},
	);

export type UserFormData = z.infer<typeof userSchema>;
export type UserEditFormData = z.infer<typeof userEditSchema>;

interface ApiResponse<T> {
	success: boolean;
	data?: T;
	errors?: { field: string; message: string }[];
}

interface User {
	id: string;
	name: string;
	email: string;
	registration: string;
	role: string;
	createdAt: string;
}

export async function getUsers(): Promise<ApiResponse<User[]>> {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				registration: true,
				role: true,
				createdAt: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return {
			success: true,
			data: users.map((user) => ({
				...user,
				createdAt: user.createdAt.toISOString(),
			})),
		};
	} catch (error) {
		console.error("Erro ao carregar usuários:", error);
		return {
			success: false,
			errors: [
				{
					field: "root",
					message: "Erro ao carregar usuários",
				},
			],
		};
	}
}

export async function createUser(
	data: UserFormData,
): Promise<ApiResponse<User>> {
	try {
		const hashedPassword = await bcrypt.hash(data.password, 10);

		const user = await prisma.user.create({
			data: {
				name: data.name,
				email: data.email,
				registration: data.registration,
				role: data.role,
				password: hashedPassword,
			},
			select: {
				id: true,
				name: true,
				email: true,
				registration: true,
				role: true,
				createdAt: true,
			},
		});

		return {
			success: true,
			data: {
				...user,
				createdAt: user.createdAt.toISOString(),
			},
		};
	} catch (error) {
		console.error("Erro ao criar usuário:", error);
		if (error instanceof Error) {
			if (error.message.includes("Unique constraint")) {
				if (error.message.includes("email")) {
					return {
						success: false,
						errors: [
							{
								field: "email",
								message: "Este email já está em uso",
							},
						],
					};
				}
				if (error.message.includes("registration")) {
					return {
						success: false,
						errors: [
							{
								field: "registration",
								message: "Esta matrícula já está em uso",
							},
						],
					};
				}
			}
		}
		return {
			success: false,
			errors: [
				{
					field: "root",
					message: "Erro ao criar usuário",
				},
			],
		};
	}
}

export async function updateUser(
	id: string,
	data: UserEditFormData,
): Promise<ApiResponse<User>> {
	try {
		const updateData: any = {
			name: data.name,
			email: data.email,
			registration: data.registration,
			role: data.role,
		};

		if (data.password) {
			updateData.password = await bcrypt.hash(data.password, 10);
		}

		const user = await prisma.user.update({
			where: { id },
			data: updateData,
			select: {
				id: true,
				name: true,
				email: true,
				registration: true,
				role: true,
				createdAt: true,
			},
		});

		return {
			success: true,
			data: {
				...user,
				createdAt: user.createdAt.toISOString(),
			},
		};
	} catch (error) {
		console.error("Erro ao atualizar usuário:", error);
		if (error instanceof Error) {
			if (error.message.includes("Unique constraint")) {
				if (error.message.includes("email")) {
					return {
						success: false,
						errors: [
							{
								field: "email",
								message: "Este email já está em uso",
							},
						],
					};
				}
				if (error.message.includes("registration")) {
					return {
						success: false,
						errors: [
							{
								field: "registration",
								message: "Esta matrícula já está em uso",
							},
						],
					};
				}
			}
		}
		return {
			success: false,
			errors: [
				{
					field: "root",
					message: "Erro ao atualizar usuário",
				},
			],
		};
	}
}

export async function deleteUser(id: string): Promise<ApiResponse<void>> {
	try {
		await prisma.user.delete({
			where: { id },
		});

		return {
			success: true,
		};
	} catch (error) {
		console.error("Erro ao excluir usuário:", error);
		return {
			success: false,
			errors: [
				{
					field: "root",
					message: "Erro ao excluir usuário",
				},
			],
		};
	}
}
