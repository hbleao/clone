type Grid = {
	mobile?: number[];
	portrait?: number[];
	landscape?: number[];
	desktop?: number[];
	wide?: number[];
};

/**
 * Cria uma referência de grade personalizada com base no tamanho do array fornecido.
 * @param arrayReference Um array de referência para determinar o tamanho da grade.
 * @param grid Um array de configurações de grade.
 * @returns Uma nova grade personalizada alinhada ao tamanho do array de referência.
 */
export function createCustomGrid(arrayReference: unknown[] = [], grid: Grid[] = []): Grid[] {
	if (!Array.isArray(arrayReference)) {
		return grid;
	}

	const customGrid: Grid[] = [];
	const maxGridIndex = grid.length - 1;

	// Iterar sobre o array de referência para criar a nova grade
	arrayReference.forEach((_, index) => {
		const gridIndex = index % (maxGridIndex + 1);
		customGrid.push(grid[gridIndex]);
	});

	return customGrid;
}
