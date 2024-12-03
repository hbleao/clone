/**
 * Formats a string as a Brazilian phone number.
 * Handles both 10-digit and 11-digit formats.
 * @param value - The input string to format.
 * @returns The formatted phone number string.
 */
export const phoneMask = (value: string): string => {
	if (typeof value !== 'string') return '';

	const cleanPhoneNumber = value.replace(/\D/g, '').slice(0, 11);

	return cleanPhoneNumber.length <= 10
		? cleanPhoneNumber.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
		: cleanPhoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};
