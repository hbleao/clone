import { type RefObject, useEffect, useRef, useState } from 'react';

interface IntersectionObserverArgs {
	root?: Element | null;
	rootMargin?: string;
	threshold?: number | number[];
}

interface UseIntersectionObserverReturn {
	ref: RefObject<HTMLDivElement>;
	entry: IntersectionObserverEntry | null;
}

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

		const observer = new IntersectionObserver(([entry]) => setEntry(entry), {
			root,
			rootMargin,
			threshold,
		});

		observer.observe(node);

		return () => {
			observer.unobserve(node);
		};
	}, [root, rootMargin, threshold]);

	return { ref, entry };
};
