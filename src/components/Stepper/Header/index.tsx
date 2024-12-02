import type { HTMLAttributes, ReactNode } from 'react';

import { joinClasses } from '@porto-ocean/utils';

type TWizardHeader = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode | ReactNode[];
};

export const Header = ({ children, className, ...props }: TWizardHeader) => {
	return (
		<div
			className={joinClasses(['stepper__header', String(className)])}
			{...props}
		>
			{children}
		</div>
	);
};
