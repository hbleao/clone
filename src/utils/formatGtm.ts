/**
 * Interface para dados do GTM
 */
export interface GTMData {
  event?: string;
  category?: string;
  action?: string;
  label?: string;
  value?: string | number;
  [key: string]: any;
}

/**
 * Formata texto para uso no Google Tag Manager
 * Remove acentos, caracteres especiais e converte para lowercase
 * @param text - Texto a ser formatado
 * @returns Texto formatado para GTM
 */
export const formatGtmText = (text: string | undefined): string => {
  if (!text?.trim()) return '';
  
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .toLocaleLowerCase()
    .trim()
    .replace(/(<([^>]+)>)|[`~!@#$%^&*()_|+=?;:'",.<>{}[\]\\/]/gi, '') // Remove caracteres especiais e tags HTML
    .split(/\s+/) // Split em qualquer quantidade de espaços
    .join('-');
};

/**
 * Formata dados para o Google Tag Manager
 * @param data - Objeto com dados para o GTM
 * @returns Objeto formatado para GTM
 */
export const formatGtm = (data: GTMData): GTMData => {
  if (!data || typeof data !== 'object') return {};

  return Object.entries(data).reduce((acc, [key, value]) => {
    // Se o valor for string, formata usando formatGtmText
    acc[key] = typeof value === 'string' ? formatGtmText(value) : value;
    return acc;
  }, {} as GTMData);
};
