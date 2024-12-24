import type { DetailedHTMLProps, HTMLAttributes } from 'react';

export type SpinnerProps = DetailedHTMLProps<
	HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
> & {
	size: 'sm' | 'md' | 'lg';
};
