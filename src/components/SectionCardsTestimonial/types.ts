export type CardTestimonial = {
	name: string;
	date: string;
	service: string;
	text: string;
	avatar: string;
};

export type SectionsCardsTestimonialProps = {
	sectionTitle: string;
	titleSectionTag: string;
	hasArrows: true;
	cards: CardTestimonial[];
};
