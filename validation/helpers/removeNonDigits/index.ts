/* eslint-disable no-useless-escape */
export function removeNonDigits(value: string): string {
	return value.replace(/\D/g, '');
}
