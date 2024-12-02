export const formatGtm = (text: string | undefined): string => {
	if (!text) return '';
	return (
		text
			.normalize('NFD')
			// biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
			.replace(/[\u0300-\u036f.]/g, '')
			.toLocaleLowerCase()
			.trim()
			.replace(/(<([^>]+)>)|[`~!@#$%^&*()_|+=?;:'",.<>{}[\]\\/]/gi, '')
			.split(' ')
			.join('-')
	);
};
