export interface FieldValidation {
	field: string;
	errorMessage?: string;
	validate: (value: string) => Error | null;
}
