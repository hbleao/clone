import { Grid } from '@porto-ocean/grid';
import { Row } from '@porto-ocean/row';
import * as TextBody from '@porto-ocean/text-body';

import s from './styles.module.scss';

import { Link } from '../Link';

import type { SectionTextBodyProps } from './types';

export const SectionTextBody = ({
	title,
	text,
	link,
}: SectionTextBodyProps) => {
	return (
		<section className={s.sectionTextBody}>
			<Grid>
				<Row>
					<TextBody.Root>
						<TextBody.Title>{title}</TextBody.Title>
						<TextBody.Text>{text}</TextBody.Text>
						{link?.label && (
							<TextBody.Buttons>
								<Link
									variant={link?.variant}
									styles={link?.styles}
									href={link.href}
									data-gtm-type="click"
									data-gtm-clicktype="button"
									data-gtm-name="atendimento-centro-automotivo-porto"
									data-gtm-subname="envie-email"
								>
									{link.label}
								</Link>
							</TextBody.Buttons>
						)}
					</TextBody.Root>
				</Row>
			</Grid>
		</section>
	);
};
