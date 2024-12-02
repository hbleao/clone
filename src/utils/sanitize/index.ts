import sanitizeHtml from 'sanitize-html';

export const sanitize = (dirtyValue: string) => {
	const valueWithoutSpecialCharacter = dirtyValue.replace(/[^a-zA-Z0-9 ]/g, '');

	const value = sanitizeHtml(valueWithoutSpecialCharacter);
	return value;
};
