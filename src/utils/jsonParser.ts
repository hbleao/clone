export function safeJsonParse(input: any, defaultValue: any = {}): any {
	// Se já for um objeto, retorna diretamente
	if (typeof input === "object" && input !== null) {
		console.log("Input já é um objeto:", input);
		return input;
	}

	// Se for null ou undefined, retorna o valor padrão
	if (input === null || input === undefined) {
		console.log("Input é null/undefined, retornando valor padrão");
		return defaultValue;
	}

	// Se for uma string, tenta fazer parse
	if (typeof input === "string") {
		try {
			console.log("Tentando fazer parse da string:", input);
			const parsed = JSON.parse(input);
			console.log("Parse bem-sucedido:", parsed);
			return parsed;
		} catch (error) {
			console.error("Erro ao fazer parse do JSON:", {
				input,
				error,
				inputType: typeof input,
				inputLength: input.length,
			});
			return defaultValue;
		}
	}

	// Para qualquer outro tipo, retorna o valor padrão
	console.log("Tipo não reconhecido, retornando valor padrão:", input);
	return defaultValue;
}
