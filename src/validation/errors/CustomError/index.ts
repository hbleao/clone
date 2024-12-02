melhore esse codigo para deixa lo o mais entendivel possivel para humanos respeitando boas praticas de desenvolvimentomento de software e depois crie testes automatizados utilizando vitest e typescript, passando por todos os casos de uso, com cobertura de 100% de coverage e prevendo cenario de sucesso e erro.

export class CustomError extends Error {
	constructor(errorMessage?: string) {
		const error = errorMessage ? errorMessage : 'Valor inválido';
		super(error);
	}
}
