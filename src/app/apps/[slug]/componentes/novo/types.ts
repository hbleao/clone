export type FieldType =
	| "text"
	| "textarea"
	| "wysiwyg"
	| "number"
	| "select"
	| "image"
	| "object"
	| "array";

export type Option = {
	label: string;
	value: string;
};

export type Field = {
	name: string;
	type: FieldType;
	label: string;
	required: boolean;
	options?: Option[];
	fields?: Field[]; // Para campos do tipo object
	arrayType?: {
		// Para campos do tipo array
		type: FieldType;
		fields?: Field[];
	};
};
