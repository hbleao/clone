import type React from 'react';

type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const Header = ({ ...props }: DialogHeaderProps) => {
	return <div className="dialog__header" {...props} />;
};
