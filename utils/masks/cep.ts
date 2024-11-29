export const cepMask = (value: string): string => {
	let numericValue = value.replace(/\D/g, '');

	if (numericValue.length > 8) {
		numericValue = numericValue.substring(0, 8);
	}

	return numericValue.replace(/^(\d{5})(\d)/, '$1-$2');
};
