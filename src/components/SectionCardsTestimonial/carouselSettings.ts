type GetCarouselOptions = {
	cardNumber: number;
	hasDots?: boolean;
	hasArrows?: boolean;
};

export function getCarouselOptions({
	cardNumber,
	hasDots = true,
}: GetCarouselOptions) {
	const settings = {
		slidesToShow: cardNumber > 4 ? 4.2 : cardNumber,
		dots: hasDots,
		arrows: false,
		infinite: false,
		responsive: [
			{
				breakpoint: 1600,
				settings: {
					slidesToShow: cardNumber > 4 ? 4.2 : cardNumber,
					dots: cardNumber < 4,
				},
			},
			{
				breakpoint: 1224,
				settings: {
					slidesToShow: cardNumber >= 4 ? 3 : cardNumber,
					dots: cardNumber <= 4,
				},
			},
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: cardNumber > 3 ? 2 : cardNumber,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: cardNumber > 1 ? 1.995 : 1,
				},
			},
			{
				breakpoint: 550,
				settings: {
					slidesToShow: cardNumber > 1 ? 1.2 : 1,
				},
			},
		],
	};

	return { settings };
}
