export function extractCheckDigits(value: string): string {
  if (typeof value !== 'string' || value.length < 2) {
    console.warn('Entrada inválida para extractCheckDigits. Retornando string vazia.');
    return '';
  }
  return value.slice(-2);
}
