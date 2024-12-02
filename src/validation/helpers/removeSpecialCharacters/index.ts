/* eslint-disable no-useless-escape */
export function removeSpecialCharacters(value = ''): string {
	if (!value) return value;
	return value.replace(/[/\\.\-]/g, '').trim();
}
