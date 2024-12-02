import * as Breadcrumb from '@porto-ocean/breadcrumb';
import { Grid } from '@porto-ocean/grid';
import { Row } from '@porto-ocean/row';

import type { Link, SectionBreadcrumbProps } from './types';

export const SectionBreadcrumb = ({
	theme = 'light',
	links,
	marginBottom = '',
}: SectionBreadcrumbProps) => (
	<section className={`section-breadcrumb ${marginBottom}`}>
		<Grid>
			<Row>
				<Breadcrumb.Root theme={theme}>
					<Breadcrumb.List>
						{links.map((link: Link) => (
							<Breadcrumb.ListItem key={link.name}>
								<a href={link.url}>{link.name}</a>
							</Breadcrumb.ListItem>
						))}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</Row>
		</Grid>
	</section>
);
