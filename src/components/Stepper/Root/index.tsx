import type { HTMLAttributes } from 'react';

import { joinClasses } from '@porto-ocean/utils';

type TStepperRoot = HTMLAttributes<HTMLDivElement>;

export const Root = ({ children, className, ...props }: TStepperRoot) => {
	return (
		<div className={joinClasses(['stepper', String(className)])} {...props}>
			{children}
		</div>
	);
};
