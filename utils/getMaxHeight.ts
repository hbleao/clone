export function getMaxHeight(classComponentName: string) {
	let maxHeight = 0;
	const cards = document.querySelectorAll(classComponentName);
	const offset = 10;
	for (let i = 0; i <= cards?.length; i++) {
		const currentHeight = cards[i]?.clientHeight;
		if (currentHeight >= maxHeight) {
			maxHeight = currentHeight + offset;
		}
	}

	return maxHeight;
}
