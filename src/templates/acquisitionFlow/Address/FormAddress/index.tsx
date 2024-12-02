import { Icon } from '@porto-ocean/icon';
import * as Input from '@porto-ocean/input';
import { useEffect } from 'react';

import { useUserStore } from '@/store';

import * as Checkbox from '@/components/Checkbox';

import { onlyNumbers, sanitize } from '@/utils';
import {
	ValidationBuilder,
	ValidationComposite,
} from '@/validation/validators';

import type { FormAddressProps } from './types';

export const FormAddress = ({ state, dispatch }: FormAddressProps) => {
	const address = useUserStore((state) => state.user.address);
	const setAddressUser = useUserStore((state) => state.setAddressUser);
	const { fields, isDefaultCep } = state;

	function handleInputValue(fieldName: string, fieldValue: string) {
		dispatch({
			type: 'setFieldValue',
			fieldName: fieldName,
			payload: fieldValue,
		});

		setAddressUser({
			...fields,
			[fieldName]: fieldValue,
		});
	}

	function handleFieldsValidation() {
		const numberValidation = state.fields.withoutNumber
			? { ...ValidationBuilder.field('number').build() }
			: { ...ValidationBuilder.field('number').required().build() };

		const defaultCepValidation = state.isDefaultCep
			? {
					...ValidationBuilder.field('street').required().build(),
					...ValidationBuilder.field('neighborhood').required().build(),
				}
			: {
					...ValidationBuilder.field('street').build(),
					...ValidationBuilder.field('neighborhood').build(),
				};

		const validation = ValidationComposite.build([
			numberValidation,
			...ValidationBuilder.field('complement').build(),
			defaultCepValidation,
		]);

		const fieldsValidation = [
			{ field: 'street', value: fields.street },
			{ field: 'number', value: fields.number },
			{ field: 'complement', value: fields.complement },
			{ field: 'neighborhood', value: fields.neighborhood },
		];

		for (let i = 0; i < fieldsValidation.length; i++) {
			if (fieldsValidation[i].value) {
				dispatch({
					type: 'setErrors',
					fieldName: fieldsValidation[i].field,
					payload: validation.validate(
						fieldsValidation[i].field,
						fieldsValidation[i].value,
					),
				});
			}
		}
	}

	useEffect(() => {
		handleFieldsValidation();
	}, [state.fields]);

	return (
		<div className="form-address">
			<Input.Root width="fluid" disabled filled={!!address.cep}>
				<Input.Box>
					<Input.Label>Cep</Input.Label>
					<Input.Field value={address.cep} />
					<Icon
						iconName="icon-porto-ic-edit"
						className="toggle-cep-icon"
						size="text-lg"
						data-gtm-type="click"
						data-gtm-clicktype="button"
						data-gtm-name="porto-servico:local-do-servico"
						data-gtm-subname="confirme-onde-o-servico-sera-realizado:cep:editar"
						onClick={() => {
							dispatch({ type: 'toggleDialog' });
							window.dataLayer.push({
								event: 'dialog',
								action: 'open',
								name: 'voce-deseja-mudar-o-local-do-servico',
							});
						}}
					/>
				</Input.Box>
			</Input.Root>

			<Input.Root
				width="fluid"
				filled={!!fields.street}
				disabled={isDefaultCep}
			>
				<Input.Box>
					<Input.Label>Rua</Input.Label>
					<Input.Field
						data-gtm-type="form"
						data-gtm-clicktype="input"
						data-gtm-name="porto-servico:local-do-servico"
						data-gtm-subname="confirme-onde-o-servico-sera-realizado:rua"
						value={fields.street}
						onChange={(e) =>
							handleInputValue('street', sanitize(e.target.value))
						}
					/>
				</Input.Box>
			</Input.Root>

			<Input.Root
				width="fluid"
				filled={!!fields.number}
				disabled={fields.withoutNumber}
			>
				<Input.Box>
					<Input.Label>Número</Input.Label>
					<Input.Field
						data-gtm-type="form"
						data-gtm-clicktype="input"
						data-gtm-name="porto-servico:local-do-servico"
						data-gtm-subname="confirme-onde-o-servico-sera-realizado:numero"
						value={state.fields.number}
						onChange={(e) =>
							handleInputValue('number', onlyNumbers(sanitize(e.target.value)))
						}
					/>
				</Input.Box>
			</Input.Root>

			<Checkbox.Root
				variant={fields.withoutNumber ? 'checked' : 'default'}
				data-gtm-type="form"
				data-gtm-clicktype="input"
				data-gtm-name="porto-servico:local-do-servico"
				data-gtm-subname="confirme-onde-o-servico-sera-realizado:meu-endereco-nao-tem-numero"
				onClick={() =>
					dispatch({
						type: 'setFieldValue',
						fieldName: 'withoutNumber',
						payload: !fields.withoutNumber,
					})
				}
			>
				<Checkbox.Input />
				<Checkbox.Label>Meu endereço não tem número</Checkbox.Label>
			</Checkbox.Root>

			<Input.Root width="fluid" filled={!!fields.complement}>
				<Input.Box>
					<Input.Label>Complemento (Opcional)</Input.Label>
					<Input.Field
						data-gtm-type="form"
						data-gtm-clicktype="input"
						data-gtm-name="porto-servico:local-do-servico"
						data-gtm-subname="confirme-onde-o-servico-sera-realizado:complemento"
						value={fields.complement}
						onChange={(e) =>
							handleInputValue('complement', sanitize(e.target.value))
						}
					/>
				</Input.Box>
			</Input.Root>

			<Input.Root
				width="fluid"
				disabled={isDefaultCep}
				filled={!!fields.neighborhood}
			>
				<Input.Box>
					<Input.Label>Bairro</Input.Label>
					<Input.Field
						data-gtm-type="form"
						data-gtm-clicktype="input"
						data-gtm-name="porto-servico:local-do-servico"
						data-gtm-subname="confirme-onde-o-servico-sera-realizado:bairro"
						value={fields.neighborhood}
						onChange={(e) =>
							handleInputValue('neighborhood', sanitize(e.target.value))
						}
					/>
				</Input.Box>
			</Input.Root>

			<Input.Root width="fluid" disabled filled={!!fields.city}>
				<Input.Box>
					<Input.Label>Cidade</Input.Label>
					<Input.Field
						data-gtm-type="form"
						data-gtm-clicktype="input"
						data-gtm-name="porto-servico:local-do-servico"
						data-gtm-subname="confirme-onde-o-servico-sera-realizado:cidade"
						value={fields.city}
					/>
				</Input.Box>
			</Input.Root>

			<Input.Root width="fluid" disabled filled={!!fields.state}>
				<Input.Box>
					<Input.Label>Estado/UF</Input.Label>
					<Input.Field
						data-gtm-type="form"
						data-gtm-clicktype="input"
						data-gtm-name="porto-servico:local-do-servico"
						data-gtm-subname="confirme-onde-o-servico-sera-realizado:estado"
						value={fields.state}
					/>
				</Input.Box>
			</Input.Root>
		</div>
	);
};
