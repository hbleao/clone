import { formattedPrice } from '@/utils';

/**
 * Formats a price for Google Tag Manager by removing the currency symbol and whitespace.
 * @param value - The numeric value to format.
 * @returns The formatted price string without currency symbol and whitespace.
 */
export function formatOptionPriceToGtm(value: number): string {
	if (typeof value !== 'number' || value) return '';

	return String(formattedPrice(value)).replace('R$', '').replace(/\s/g, '');
}
