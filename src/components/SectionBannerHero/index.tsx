'use client';

import { BannerHeroCaps } from './BannerHeroCaps';
import { BannerHeroDefault } from './BannerHeroDefault';
import type { TBannerHero } from './types';

import './styles.scss';

export const SectionBannerHero = ({
	variant = 'default',
	...props
}: TBannerHero) => {
	switch (variant) {
		case 'default':
			return <BannerHeroDefault {...props} />;

		case 'caps':
			return <BannerHeroCaps {...props} />;
	}
};
