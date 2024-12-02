import { test, expect } from '@playwright/test';

const VALID_CEP = '08773-500';
const INVALID_CEP = '';

test.setTimeout(120000)

test('Show appointment list', async ({ page }) => {
	await page.goto('http://localhost:3000/servicos/desentupimento');

	const title = page.getByRole('heading', {
		name: 'Desentupimento, com o cuidado Porto',
	});

	await expect(title).toBeVisible();

	page.getByRole('heading', {
		name: 'Informe o CEP onde o serviço será realizado'
	}).scrollIntoViewIfNeeded()
	
	const priceNewDiv = page.locator('.price__new');
  await expect(priceNewDiv).toBeVisible();

  const cepPriceInput = page.locator('.input__field');
  await cepPriceInput.fill(VALID_CEP);
	await page.waitForTimeout(5000);

  const button = page.locator('button[class*="--insurance-primary"]');

  await button.click();

	await page.waitForTimeout(1000);

	const serviceOption = page.locator('.single-options__service').nth(0);
	await serviceOption.click();
	
	const serviceOptionButton = page.locator('button', { hasText: 'Agendar agora' });
	await serviceOptionButton.click();
	
	await page.waitForTimeout(2000);

	expect(page.getByRole('heading', {
		name: 'Selecione o dia e horário'
	})).toBeVisible();

	await page.waitForTimeout(10000);

	const selector = '.acquisition-flow-appointment-days__selector';

  await page.waitForSelector(selector, { timeout: 60000 });
	await page.waitForTimeout(500);

	const firstAppointmentDaysSelector = page.locator(selector).nth(0);
  const secondAppointmentDaysSelector = page.locator(selector).nth(1);

  await expect(firstAppointmentDaysSelector).toBeVisible();
  await expect(secondAppointmentDaysSelector).toBeVisible();

	await secondAppointmentDaysSelector.click();
	await firstAppointmentDaysSelector.click();

	const servicePrice = page.locator('.card-resume__service-price');
	expect(servicePrice).toBeVisible();

	const serviceLocationHours = page.locator('.acquisition-flow-appointments-hours__hour-container');
	expect(serviceLocationHours.nth(0)).toBeVisible();

	await serviceLocationHours.nth(0).click();
	await serviceLocationHours.nth(1).click();

	const appointmentButton = page.locator('button', { hasText: 'Continuar' });
	expect(appointmentButton).toBeVisible();
});
