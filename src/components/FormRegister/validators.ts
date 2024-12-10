import { type CompositeValidation, ValidationBuilder } from "@/validation";

export const schemaFields = {
	email: "",
	password: "",
};

type ExtraFields = {
	[key: string]: {
		label: string;
		helperText: string;
		placeholder: string;
	};
};

export const extraFieldsProps: ExtraFields = {
	email: {
		label: "Email",
		helperText: "O email precisa ser válido",
		placeholder: "Digite seu email",
	},
	password: {
		label: "Senha",
		helperText:
			"A senha precisa ter mais de 5 digítos <br> Um caracter especial <br> E um número",
		placeholder: "Crie sua senha",
	},
};

const V = new ValidationBuilder();

export const validators: { [key: string]: CompositeValidation } = {
	email: V.required().email().build(),
	password: V.required().password().build(),
};
