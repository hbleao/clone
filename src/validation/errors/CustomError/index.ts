export class CustomError extends Error {
	constructor(errorMessage?: string) {
		const error = errorMessage ? errorMessage : 'Valor inválido';
		super(error);
	}
}
