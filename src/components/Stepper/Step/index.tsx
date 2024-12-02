import type { HTMLAttributes } from 'react';

import { joinClasses } from '@porto-ocean/utils';

type TStepper = HTMLAttributes<HTMLDivElement> & {
	isActive?: boolean;
	isCompleted?: boolean;
};

export const Step = ({ isActive, isCompleted, ...props }: TStepper) => {
	const isActiveClass = isActive ? 'stepper__step --active' : 'stepper__step';
	const className = isCompleted
		? isActiveClass.concat(' --completed')
		: isActiveClass;

	return (
		<div
			className={joinClasses([className, String(props.className)])}
			{...props}
		/>
	);
};
