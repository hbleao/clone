export type Links = {
	icon?: string;
	name?: string;
	url: string;
	target: '_blank' | '_self';
};

export type SectionFooterProps = {
	gtmName: string;
	titleQuickLinks: string;
	quickLinks: Links[];
	titleAboutUs: string;
	aboutUs: Links[];
	titleSocialMedia: string;
	socialMedia: Links[];
	titleAppStore: string;
	buttonText: string;
	bottomLinks: Links[];
	titleModal: string;
	buttonsModal: Links[];
	buttonsAppStore: Links[];
};
