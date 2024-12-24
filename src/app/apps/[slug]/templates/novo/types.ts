export type FieldType =
	| "text"
	| "textarea"
	| "number"
	| "select"
	| "image"
	| "object"
	| "array";

export type Field = {
	name: string;
	type: FieldType;
	label: string;
	required: boolean;
	fields?: Field[]; // Para campos do tipo object
	arrayType?: {
		// Para campos do tipo array
		type: FieldType;
		fields?: Field[];
	};
};
