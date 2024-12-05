/* eslint-disable no-useless-escape */
export function removeSpecialCharacters(value: string = ''): string {
  if (typeof value !== 'string') {
    console.warn('Entrada inválida para removeSpecialCharacters. Retornando string vazia.');
    return '';
  }
  if (!value) return value;
  return value.replace(/[\/\.\-]/g, '').trim();
}
