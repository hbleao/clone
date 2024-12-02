export type Link = {
	name: string;
	url: string;
};

export type SectionBreadcrumbProps = {
	theme?: 'dark' | 'light';
	links: Link[];
	marginBottom?: 'margin-default' | '';
};
