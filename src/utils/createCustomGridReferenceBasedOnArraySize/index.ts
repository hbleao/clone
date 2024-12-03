interface GridBreakpoints {
	mobile?: number[];
	portrait?: number[];
	landscape?: number[];
	desktop?: number[];
	wide?: number[];
}

const GRID_CONFIG = {
	MAX_GRID_SIZE: 3,
	INITIAL_INDEX: 0,
};

/**
 * Cria um grid customizado baseado no tamanho do array de referência
 *
 * Esta função gera um grid que se repete ciclicamente baseado no tamanho
 * do array de referência. O grid é usado para definir o layout em diferentes
 * breakpoints de tela.
 *
 * @param {any[]} arrayReference - Array que serve como referência para o tamanho do grid
 * @param {GridBreakpoints[]} grid - Array de configurações de grid para diferentes breakpoints
 * @returns {GridBreakpoints[]} Array de grids customizado baseado no tamanho do array de referência
 *
 * @example
 * const items = ['item1', 'item2', 'item3', 'item4'];
 * const gridConfig = [
 *   { mobile: [12], tablet: [6], desktop: [4] },
 *   { mobile: [12], tablet: [6], desktop: [8] }
 * ];
 * const customGrid = CreateCustomGridReferenceBasedOnArraySize(items, gridConfig);
 */
export function CreateCustomGridReferenceBasedOnArraySize(
	arrayReference: any[] = [],
	grid: GridBreakpoints[] = [],
): GridBreakpoints[] {
	if (!Array.isArray(arrayReference)) {
		return grid;
	}

	const customGrid: GridBreakpoints[] = [];
	let gridIndex = GRID_CONFIG.INITIAL_INDEX;

	// biome-ignore lint/complexity/noForEach: <explanation>
	arrayReference.forEach(() => {
		customGrid.push(grid[gridIndex]);

		gridIndex =
			gridIndex < GRID_CONFIG.MAX_GRID_SIZE
				? gridIndex + 1
				: GRID_CONFIG.INITIAL_INDEX;
	});

	return customGrid;
}
