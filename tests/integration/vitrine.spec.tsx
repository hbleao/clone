import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
	await page.goto('http://localhost:3000/servicos');
	const name = 'Até para quem ainda não é cliente Porto';

	const title = page.getByRole('heading', { name });
	await expect(title).toBeInViewport();
});
