import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// Criar usuário admin
	const admin = await prisma.user.upsert({
		where: { email: "admin@example.com" },
		update: {},
		create: {
			name: "Administrador",
			email: "admin@example.com",
			password: "admin123", // Você deve alterar esta senha em produção
			registration: "admin123",
			role: "ADMIN",
		},
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
