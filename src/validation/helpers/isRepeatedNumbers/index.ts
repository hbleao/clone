import { removeSpecialCharacters } from '..';

export function isRepeatedNumbers(
	value: string,
	quant_digits: number,
): boolean {
	if (typeof value !== 'string' || quant_digits <= 0) {
		console.warn('Entrada inválida para isRepeatedNumbers. Retornando false.');
		return false;
	}

	const valueWithoutSpecialCharacters = removeSpecialCharacters(value);

	for (let i = 0; i < 10; i++) {
		const matrix = Array(quant_digits).fill(i).join('');
		if (matrix === valueWithoutSpecialCharacters) {
			return true;
		}
	}

	return false;
}
