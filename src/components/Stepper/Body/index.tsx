import type { HTMLAttributes, ReactNode } from 'react';

import { joinClasses } from '@porto-ocean/utils';

type TStepperBody = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode | ReactNode[];
};

export const Body = ({ children, className, ...props }: TStepperBody) => {
	return (
		<div
			className={joinClasses(['stepper__body', String(className)])}
			{...props}
		>
			{children}
		</div>
	);
};
