import { type RefObject, useState } from 'react';

interface IntersectionObserverArgs {
	root?: Element | null;
	rootMargin?: string;
	threshold?: number | number[];
}

interface UseIntersectionObserverReturn {
	ref: RefObject<HTMLDivElement>;
	entry: IntersectionObserverEntry | null;
}

/**
 * Hook para gerenciar a interseção de um elemento DOM com base no Intersection Observer API.
 * @param root O elemento raiz usado como contêiner de visualização. Padrão: `null`.
 * @param rootMargin A margem ao redor do contêiner de visualização. Padrão: `'0px'`.
 * @param threshold O nível de interseção necessário para disparar o callback. Padrão: `0`.
 * @returns Um objeto contendo a referência do elemento e os detalhes da interseção.
 */
export const useIntersectionObserver = ({
	root = null,
	rootMargin = '0px',
	threshold = 0,
}: IntersectionObserverArgs): UseIntersectionObserverReturn => {
	const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		// Callback chamado quando a interseção muda
		const observerCallback: IntersectionObserverCallback = ([entry]) => {
			setEntry(entry);
		};

		// Criar o observador
		const observer = new IntersectionObserver(observerCallback, {
			root,
			rootMargin,
			threshold,
		});

		// Observar o elemento
		observer.observe(node);

		// Limpar o observador quando o componente desmontar ou as dependências mudarem
		return () => {
			observer.disconnect();
		};
	}, [root, rootMargin, threshold]);

	return { ref, entry };
};
