'use client';
import { Icon } from '@porto-ocean/icon';

import './styles.scss';

export const HeaderStore = () => {
	return (
		<div className="header__container">
			<Icon iconName="icon-logo" color="portoSegurosPrimary" size="text-3xl" />
		</div>
	);
};
