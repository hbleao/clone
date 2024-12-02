import type { Color } from '../SectionBannerBody/type';

type BannerHeroBaseProps = {
	marginBottom: string;
	bannerHero: {
		title: string;
		description: string;
		subTitle: string;
		preTitle: string;
		theme: 'light' | 'dark';
		image: {
			alt: string;
			src: string;
		};
		bgColor: Color;
		button?: {
			label: string;
			variant: string;
			link: string;
		};
	};
};

export type BannerHeroCapsProps = BannerHeroBaseProps & {
	ctaLabel: string;
};

export type BannerHeroDefaultProps = BannerHeroBaseProps;

export type TBannerHero =
	| ({
			variant: 'default';
	  } & BannerHeroDefaultProps)
	| ({
			variant: 'caps';
	  } & BannerHeroCapsProps);
