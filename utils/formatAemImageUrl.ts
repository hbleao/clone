
/**
 * Formata uma URL de imagem da AEM para incluir o domínio completo.
 * @param url A URL parcial da imagem fornecida pela AEM.
 * @returns Uma URL completa da imagem ou uma string vazia caso a URL seja inválida.
 */

export function formatAemImageUrl(url: string): string {
	// Verificar se a URL é válida
	if (!url || typeof url !== 'string') {
		console.error('Invalid URL provided for formatting:', url);
		return '';
	}

	// Adicionar o domínio completo à URL
	const baseUrl = 'https://www.portoseguro.com.br/';
	return `${baseUrl}${url}`;
}
