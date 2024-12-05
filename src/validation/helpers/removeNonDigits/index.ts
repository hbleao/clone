/* eslint-disable no-useless-escape */
export function removeNonDigits(value: string): string {
  if (typeof value !== 'string') {
    console.warn('Entrada inválida para removeNonDigits. Retornando string vazia.');
    return '';
  }
  return value.replace(/\D/g, '');
}
