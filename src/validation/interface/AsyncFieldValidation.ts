export interface AsyncFieldValidation {
	field: string;
	errorMessage?: string;
	validate: (value: string) => Promise<Error | null>;
}
