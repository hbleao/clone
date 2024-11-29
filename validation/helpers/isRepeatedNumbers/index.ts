import { removeSpecialCharacters } from '..';

export function isRepeatedNumbers(
	value: string,
	quant_digits: number,
): boolean {
	const INITIAL_COUNT = 0;
	const NUMBER_OF_INTERACTIONS = 10;
	const valueWithoutSpecialCharacters = removeSpecialCharacters(value);
	let isValid = true;

	for (let i = INITIAL_COUNT; i < NUMBER_OF_INTERACTIONS; i++) {
		const matrix = [...Array(quant_digits).fill(i)].join('');
		if (matrix === valueWithoutSpecialCharacters) {
			isValid = false;
		}
	}

	return isValid;
}
