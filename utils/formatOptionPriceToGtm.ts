import { formattedPrice } from '@/utils';

export function formatOptionPriceToGtm(value: number) {
	return String(formattedPrice(value)).replace('R$', '').replace(/\s/, '');
}
