declare type Field = {
	name: string;
	type: string;
	label: string;
	required?: boolean;
	options?: Array<{ value: string; label: string }>;
	fields?: Field[];
	arrayType?: {
		type: string;
		fields?: Field[];
	};
};

declare type Schema = {
	fields: Field[];
};
