import type { DetailedHTMLProps, HTMLAttributes } from 'react';

import s from './styles.module.scss';

export type SwitchProps = DetailedHTMLProps<
	HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
> & {
	value?: boolean;
	size?: 'sm' | 'md';
	width?: 'fluid' | 'contain';
};

export const Switch = ({
	size = 'sm',
	width = 'contain',
	value,
	...props
}: SwitchProps) => {
	const containerClass = value ? s.switchChecked : s.switchNoChecked;
	const circleClass = value ? s.checked : s.noChecked;

	return (
		<div
			className={`${s.switch} ${s[size]} ${s[width]} ${containerClass}`}
			{...props}
		>
			<span className={`${s.circle} ${circleClass}`} />
		</div>
	);
};
