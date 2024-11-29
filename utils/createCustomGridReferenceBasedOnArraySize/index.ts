type Grid = {
	mobile?: number[];
	portrait?: number[];
	landscape?: number[];
	desktop?: number[];
	wide?: number[];
};

export function CreateCustomGridReferenceBasedOnArraySize(
	arrayReference: any[] = [],
	grid: Grid[] = [],
): Grid[] {
	let counter = 0;
	const customGrid = [] as any;

	if (!Array.isArray(arrayReference)) return grid;

	// biome-ignore lint/complexity/noForEach: <explanation>
	arrayReference.forEach(() => {
		const maxGridNumber = 3;
		const initialGridIndex = 0;

		customGrid.push(grid[counter]);
		counter = counter < maxGridNumber ? counter + 1 : initialGridIndex;
	});

	return customGrid;
}
