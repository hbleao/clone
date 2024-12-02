import './styles.scss';

import { Grid } from '@porto-ocean/grid';
import { Row } from '@porto-ocean/row';

import type { TFloatButtonProps } from './types';

export const FloatButton = ({
	title = '',
	ctaLabel,
	ctaLink,
	isActive,
}: TFloatButtonProps) => {
	const rootClassName = isActive ? 'float-button --active' : 'float-button';
	return (
		<Grid className={rootClassName}>
			<Row className="float-button__row">
				<div className="float-button__container">
					<div
						className="typography --title5"
						dangerouslySetInnerHTML={{ __html: `${title}` }}
					/>
					<a
						className="btn --insurance-primary --contain --large"
						href={ctaLink}
					>
						{ctaLabel}
					</a>
				</div>
			</Row>
		</Grid>
	);
};
