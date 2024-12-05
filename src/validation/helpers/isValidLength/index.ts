export function isValidLength(value: string, length: number): boolean {
  if (typeof value !== 'string' || typeof length !== 'number' || length < 0) {
    console.warn('Entrada inválida para isValidLength. Retornando false.');
    return false;
  }
  return value.length === length;
}
