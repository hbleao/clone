
/**
 * Obtém a altura máxima de elementos baseados em uma classe de componente.
 * @param classComponentName Nome da classe dos elementos a serem avaliados.
 * @returns A altura máxima encontrada com um deslocamento adicionado.
 */
export function getMaxHeight(classComponentName: string): number {
	if (!classComponentName) {
		console.error('Class name is required.');
		return 0;
	}

	const offset = 10;
	let maxHeight = 0;

	try {
		const cards = document.querySelectorAll(classComponentName);

		cards.forEach((card) => {
			const currentHeight = card.clientHeight || 0;
			if (currentHeight > maxHeight) {
				maxHeight = currentHeight + offset;
			}
		});
	} catch (error) {
		console.error('Error calculating max height:', error);
	}

	return maxHeight;
}
