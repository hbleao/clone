

import { useEffect, useState } from 'react';

/**
 * Hook para criar um valor debounced.
 * O valor só será atualizado após o atraso especificado.
 * @param value O valor que será debounced.
 * @param delay O atraso em milissegundos para o debounce.
 * @returns O valor debounced.
 */
export function useDebounce<T>(value: T, delay: number): T {
	// Estado para armazenar o valor debounced
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Atualizar o valor debounced após o delay
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Limpar o timeout se o valor ou o delay mudarem
		return () => clearTimeout(handler);
	}, [value, delay]);

	return debouncedValue;
}
