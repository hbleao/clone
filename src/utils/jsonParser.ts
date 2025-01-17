export function safeJsonParse(input: any, defaultValue: any = {}): any {
	// Se já for um objeto, retorna diretamente
	if (typeof input === "object" && input !== null) {
		return input;
	}

	// Se for null ou undefined, retorna o valor padrão
	if (input === null || input === undefined) {
		return defaultValue;
	}

	// Se for uma string, tenta fazer parse
	if (typeof input === "string") {
		try {
			const parsed = JSON.parse(input);
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
	return defaultValue;
}
