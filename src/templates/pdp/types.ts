export type TemplatePdpProps = {
	className?: string;
	sku?: string;
	layout: {
		header: any;
		footer: any;
	};
	sections?: {
		name: string | any;
		component: React.ReactNode;
	}[];
	price?: number;
};
