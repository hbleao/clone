import type { HTMLAttributes } from 'react';

export type RootProps = HTMLAttributes<HTMLDivElement> & {
	variant?: 'default' | 'checked' | 'disabled';
};
