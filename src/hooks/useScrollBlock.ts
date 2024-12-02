import { useRef } from 'react';

/**
 * Hook para bloquear e permitir o scroll na página.
 * @returns Um array contendo duas funções:
 * - `blockScroll`: Bloqueia o scroll.
 * - `allowScroll`: Permite o scroll.
 */
export const useScrollBlock = (): [blockScroll: () => void, allowScroll: () => void] => {
	// Garantir que o hook funcione apenas em ambientes que suportam o `document`
	if (typeof document === 'undefined') {
		return [() => null, () => null];
	}

	const scrollBlocked = useRef(false);
	const html = document.documentElement;
	const { body } = document;

	/**
	 * Bloqueia o scroll da página.
	 */
	const blockScroll = (): void => {
		if (!body?.style || scrollBlocked.current) return;

		// Calcula a largura da barra de rolagem
		const scrollBarWidth = window.innerWidth - html.clientWidth;

		// Obter o padding-right atual do body
		const bodyPaddingRight =
			parseInt(window.getComputedStyle(body).getPropertyValue('padding-right')) || 0;

		// Ajusta estilos para bloquear o scroll
		html.style.position = 'relative';
		html.style.overflow = 'hidden';
		body.style.position = 'relative';
		body.style.overflow = 'hidden';
		body.style.paddingRight = `${bodyPaddingRight + scrollBarWidth}px`;

		scrollBlocked.current = true;
	};

	/**
	 * Permite o scroll na página.
	 */
	const allowScroll = (): void => {
		if (!body?.style || !scrollBlocked.current) return;

		// Restaura os estilos originais
		html.style.position = '';
		html.style.overflow = '';
		body.style.position = '';
		body.style.overflow = '';
		body.style.paddingRight = '';

		scrollBlocked.current = false;
	};

	return [blockScroll, allowScroll];
};
