import type { Settings } from 'react-slick';

type getCarouselSettingsProps = {
	dots: boolean;
};

export function getCarouselSettings({
	dots,
}: getCarouselSettingsProps): Settings {
	return {
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		dots: dots,
		infinite: false,
	};
}
