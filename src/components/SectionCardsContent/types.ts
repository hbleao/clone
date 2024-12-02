type Button = {
	label: string;
	link: string;
	target: string;
	variant: string;
	styles: 'primary' | 'secondary' | 'ghost';
	width: 'fluid' | 'contain';
};

type CardContent = {
	headingTag: any;
	image?: {
		src: string;
		alt: string;
	};
	title: string;
	description?: string;
	button?: Button;
};

export type SectionCardsContentProps = {
	sectionTitle: string;
	gtmName: string;
	cardsContent: CardContent[];
};
