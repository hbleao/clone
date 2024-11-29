/**
 * Verifica se há campos inválidos em um objeto de campos.
 * @param fields Um objeto onde a chave é o nome do campo e o valor é o erro associado ao campo.
 * @returns O objeto de campos inválidos se houver erros, caso contrário, `false`.
 */

type InvalidFieldsProps = Record<string, string>;

export function validateFields(fields: InvalidFieldsProps): boolean | InvalidFieldsProps {
	// Verifica se todos os campos estão vazios
	const hasErrors = Object.values(fields).some((error) => error !== '');

	// Retorna o objeto de erros se houver campos inválidos ou `false` se todos os campos forem válidos
	return hasErrors ? fields : false;
}
