export type SectionComponent = {
	_uid: string;
	name: string;
	component: any;
};

export type HttpResponseHomeProps = {
	sections: SectionComponent[];
	data?: {
		title?: string;
	};
};

export type ServiceHomeProps = {
	cache?: 'force-cache' | 'no-store';
	next?: {
		revalidate: number;
	};
};
