


import { formattedPrice } from '@/utils';

/**
 * Formata um valor de preço para o formato esperado pelo GTM (Google Tag Manager).
 * @param value Valor numérico do preço a ser formatado.
 * @returns Uma string formatada no formato esperado pelo GTM, sem símbolos ou espaços adicionais.
 */
export function formatPriceForGtm(value: number): string {
	if (typeof value !== 'number' || isNaN(value)) {
		console.error('Invalid value provided for formatting:', value);
		return '';
	}

	// Formatar o preço e remover símbolos ou espaços desnecessários
	const formatted = formattedPrice(value)
		.replace('R$', '')
		.replace(/\s/g, '');

	return formatted;
}
