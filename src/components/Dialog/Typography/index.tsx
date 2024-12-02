import {
	Typography as TypographyPortoOcean,
	type TypographyProps,
} from '@porto-ocean/typography';

import { joinClasses } from '@porto-ocean/utils';

export const Typography = ({
	children,
	className,
	...props
}: TypographyProps) => (
	<TypographyPortoOcean
		variant="title5"
		weight="bold"
		className={joinClasses(['dialog__typography', String(className)])}
		{...props}
	>
		{children}
	</TypographyPortoOcean>
);
