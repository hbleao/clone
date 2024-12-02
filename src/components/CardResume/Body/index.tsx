import type { HTMLAttributes } from 'react';

export const Body = ({ ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div className="card-resume__body" {...props} />
);
