import { type IconProps, Icon as PortoOceanIcon } from '@porto-ocean/icon';

import { joinClasses } from '@porto-ocean/utils';

export const Icon = ({
	className,
	size,
	iconName,
	color,
	...props
}: IconProps) => (
	<PortoOceanIcon
		size={size}
		iconName={iconName}
		color={color}
		className={joinClasses(['dialog__icon', String(className)])}
		{...props}
	/>
);
