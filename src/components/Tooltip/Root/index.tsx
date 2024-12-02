import type { HTMLAttributes } from 'react';

export const Root = ({ ...props }: HTMLAttributes<HTMLDivElement>) => {
	return <div className="tooltip" {...props} />;
};
