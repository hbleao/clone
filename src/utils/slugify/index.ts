/**
 * Converts a string into a URL-friendly slug.
 * @param text - The input string to convert.
 * @returns The slugified string.
 */
export function slugify(text: string): string {
	if (typeof text !== 'string') return '';

	return text
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '');
}
