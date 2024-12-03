const AEM_BASE_URL = process.env.NEXT_PUBLIC_AEM_BASE_URL || 'https://www.portoseguro.com.br';

/**
 * Formata uma URL do AEM adicionando o domínio base
 * @param url - Caminho relativo da imagem no AEM
 * @returns URL completa da imagem ou string vazia se a URL for inválida
 */
export function formatAemImageUrl(url?: string): string {
  if (!url?.trim()) return '';
  
  // Remove barras duplicadas e leading/trailing slashes
  const cleanUrl = url.trim().replace(/^\/+|\/+$/g, '');
  
  return `${AEM_BASE_URL}/${cleanUrl}`;
}
