import type { HTMLAttributes } from 'react';

export const Trigger = ({ ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div className="tooltip__trigger" {...props} />
);
