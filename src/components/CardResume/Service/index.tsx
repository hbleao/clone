import { Icon } from '@porto-ocean/icon';
import type { HeadingTags, HeadingTypes } from '@porto-ocean/typography';
import { Typography } from '@porto-ocean/typography';
import type { HTMLAttributes } from 'react';

interface ServiceProps extends HTMLAttributes<HTMLDivElement> {
	title: string;
	icon?: string;
	variant?: HeadingTypes;
	variantSub?: HeadingTypes;
	as?: HeadingTags;
	subTitle?: string;
}

export const ServiceTitle = ({
	title,
	icon = 'icon-porto-ic-tools',
	variant = 'body1',
	variantSub = 'body1',
	as = 'span',
	subTitle,
	...rest
}: ServiceProps) => (
	<div className="card-resume__service" {...rest}>
		<Icon iconName={icon} />
		<div>
			<Typography
				className="card-resume__service-title"
				variant={variant}
				as={as}
			>
				{title}
			</Typography>
			{subTitle && (
				<Typography variant={variantSub} as="p">
					<span dangerouslySetInnerHTML={{ __html: subTitle }} />
				</Typography>
			)}
		</div>
	</div>
);
