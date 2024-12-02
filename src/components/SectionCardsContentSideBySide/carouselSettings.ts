import type { carouselProps } from './types';

export function getCarouselOptions({ cardNumber }: carouselProps) {
	function handleSlidesToShow(itemsLimit: number, slidesToShow: number) {
		return cardNumber > itemsLimit ? slidesToShow : cardNumber;
	}

	function handleDotsRender() {
		return cardNumber >= 4;
	}

	const breakpoints = {
		desktop: {
			slidesToShow: handleSlidesToShow(2, 3),
			breakpoint: 1024,
		},
		tabletLandscape: {
			slidesToShow: handleSlidesToShow(1, 1),
			breakpoint: 768,
		},
	};

	const settings = {
		slidesToShow: handleSlidesToShow(4, 3),
		dots: false,
		arrows: false,
		infinite: false,
		responsive: [
			{
				breakpoint: breakpoints.desktop.breakpoint,
				settings: {
					slidesToShow: breakpoints.desktop.slidesToShow,
					dots: handleDotsRender(),
				},
			},
			{
				breakpoint: breakpoints.tabletLandscape.breakpoint,
				settings: {
					slidesToShow: breakpoints.tabletLandscape.slidesToShow,
					dots: true,
				},
			},
		],
	};

	return { settings };
}
