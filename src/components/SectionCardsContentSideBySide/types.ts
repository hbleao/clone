type Button = {
	label: string;
	link: string;
	target: string;
	variant: any;
	styles: 'primary' | 'secondary' | 'ghost';
	width: 'fluid' | 'contain';
};

type CardContent = {
	image?: {
		src: string;
		alt: string;
	};
	title: string;
	link?: string;
	description?: string;
	button?: Button;
};

export type SectionCardContentSideBySideProps = {
	sectionTitle: string;
	headingTags: string;
	gtmName: string;
	cardsContent: CardContent[];
};

export type carouselProps = {
	cardNumber: number;
};
