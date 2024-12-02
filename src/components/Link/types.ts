// biome-ignore lint/style/useImportType: <explanation>
import { ReactNode } from 'react';

type Size = 'large' | 'small';
type Styles = 'primary' | 'secondary' | 'ghost';
type Variant = 'insurance' | 'disabled';

export type LinkProps = any & {
	size?: Size;
	styles?: Styles;
	width?: 'contain' | 'fluid';
	variant?: Variant;
	disabled?: string;
	className?: string;
	href: string;
	children: ReactNode;
};
