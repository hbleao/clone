import { test, expect, type Page } from "@playwright/test";

test.describe("Formulário de Registro", () => {
	test.beforeEach(async ({ page }: { page: Page }) => {
		// Acesse a página do formulário
		await page.goto("http://localhost:3000"); // Substitua pela URL correta do formulário
	});

	test("Deve exibir erro para campos obrigatórios vazios", async ({
		page,
	}: { page: Page }) => {
		// Enviar o formulário vazio
		await page.click('button[type="submit"]');

		// Verificar mensagens de erro para todos os campos obrigatórios
		const fields: string[] = ["email", "password"];
		for (const field of fields) {
			const errorLocator = page.locator(`[name="${field}"] + p`);
			await expect(errorLocator).toHaveText("O campo é obrigatório.");
		}
	});

	test("Deve validar corretamente o formato do e-mail", async ({
		page,
	}: { page: Page }) => {
		// Preencher o campo de e-mail com um valor inválido
		await page.fill('input[name="email"]', "emailinvalido");
		await page.click('button[type="submit"]');

		// Verificar mensagem de erro específica
		const errorLocator = page.locator('input[name="email"] + p');
		await expect(errorLocator).toHaveText("E-mail inválido.");
	});

	test("Deve validar corretamente o campo de senha", async ({
		page,
	}: { page: Page }) => {
		// Preencher a senha com um valor inválido
		await page.fill('input[name="password"]', "12345"); // Senha curta
		await page.click('button[type="submit"]');

		// Verificar mensagem de erro específica
		const errorLocator = page.locator('input[name="password"] + p');
		await expect(errorLocator).toHaveText(
			"A senha deve ter pelo menos 6 caracteres, incluindo um número e uma letra maiúscula.",
		);
	});

	test("Deve submeter o formulário com sucesso", async ({
		page,
	}: { page: Page }) => {
		// Preencher todos os campos corretamente
		await page.fill('input[name="email"]', "test@example.com");
		await page.fill('input[name="password"]', "Password123");

		// Enviar o formulário
		await page.click('button[type="submit"]');

		// Verificar se a notificação de sucesso é exibida
		const successNotification = page.locator(
			"text=Parabéns, sua conta foi criada!",
		);
		await expect(successNotification).toBeVisible();
	});

	test("Botão de enviar deve desabilitar durante o carregamento", async ({
		page,
	}: { page: Page }) => {
		// Preencher todos os campos corretamente
		await page.fill('input[name="email"]', "test@example.com");
		await page.fill('input[name="password"]', "Password123");

		// Submeter o formulário
		await page.click('button[type="submit"]');

		// Verificar se o botão está desabilitado durante o envio
		const submitButton = page.locator('button[type="submit"]');
		await expect(submitButton).toBeDisabled();
	});
});
