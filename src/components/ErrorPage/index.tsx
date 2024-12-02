'use client';

import './styles.scss';

import { Icon } from '@porto-ocean/icon';
import { Typography } from '@porto-ocean/typography';

import { getProps } from './getProps';

import * as Dialog from '@/components/Dialog';

export const ErrorPage = ({ refetchData }) => {
	const handleButtonClick = () => {
		refetchData?.();
	};

	const { title, subtitle, description, icon, buttonLabel } = getProps();

	return (
		<div className="error-page">
			<Icon size="text-3xl" iconName={icon} />
			<Typography
				as="h3"
				className="error-page__title"
				color="black85"
				variant="title6"
			>
				{title}
			</Typography>
			<div className="error-page__body">
				<Typography
					variant="body1"
					weight="bold"
					as="p"
					color="black85"
					className="error-page__subtitle"
				>
					{subtitle}
				</Typography>
				<Typography
					variant="body1"
					weight="regular"
					as="p"
					className="error-page__description"
					color="black75"
				>
					{description}
				</Typography>
			</div>
			<Dialog.Footer variant="row">
				<Dialog.Button width="fluid" onClick={handleButtonClick}>
					{buttonLabel}
				</Dialog.Button>
			</Dialog.Footer>
		</div>
	);
};
