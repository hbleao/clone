import * as Header from '@porto-ocean/header';
import React from 'react';

export type MenuNavProps = {
	menuLinks: any;
};

export const MenuNav = ({ menuLinks }: MenuNavProps) => {
	return (
		<Header.MenuNav>
			<Header.MenuLinks>
				{menuLinks.map((link: any, i: number) => (
					<Header.MenuLink key={`${link.label}-${i}`}>
						<Header.MenuLinkItem
							href={link.url}
							data-gtm-type="click"
							data-gtm-clicktype="header"
							data-gtm-name={link.label}
						>
							{link.label}
						</Header.MenuLinkItem>
					</Header.MenuLink>
				))}
			</Header.MenuLinks>
		</Header.MenuNav>
	);
};
