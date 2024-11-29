import { useEffect, useState } from 'react';

interface WindowDimensions {
	width: number;
	height: number;
}

/**
 * Obtém as dimensões atuais da janela do navegador.
 * @returns Um objeto contendo a largura e a altura da janela.
 */
const getWindowDimensions = (): WindowDimensions => {
	if (typeof window === 'undefined') {
		return { width: 0, height: 0 }; // Valor padrão para ambientes que não suportam `window`
	}

	const { innerWidth: width, innerHeight: height } = window;
	return { width, height };
};

/**
 * Hook para obter e monitorar as dimensões da janela do navegador.
 * @returns Um objeto contendo a largura (`width`) e altura (`height`) da janela.
 */
export const useWindowDimensions = (): WindowDimensions => {
	const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>(
		getWindowDimensions(),
	);

	useEffect(() => {
		// Função para atualizar as dimensões quando a janela é redimensionada
		const handleResize = () => {
			setWindowDimensions(getWindowDimensions());
		};

		// Adicionar o listener ao evento `resize`
		window.addEventListener('resize', handleResize);

		// Remover o listener ao desmontar o componente
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return windowDimensions;
};
