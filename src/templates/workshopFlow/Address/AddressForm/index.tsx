import { SearchCep } from '@/components/SearchCep';
import { CepGoogleMapsService } from '@/services/cepGoogleMapsService';
import { WorkshopByLatLngService } from '@/services/workshopByCep';
import { useUserStore } from '@/store';
import { cepMask, sanitize } from '@/utils';
import {
	ValidationBuilder,
	ValidationComposite,
} from '@/validation/validators';
import * as Input from '@porto-ocean/input';
import { Typography } from '@porto-ocean/typography';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { WorkshopList } from '../WorkshopList';
import type { ActionProps, Fields, InitialStateProps } from '../reducer/types';

interface AddressFormProps {
	state: InitialStateProps;
	dispatch: React.Dispatch<ActionProps>;
}

export const AddressForm = ({ state, dispatch }: AddressFormProps) => {
	const { fields, errors } = state;
	const { setVehicle } = useUserStore();
	const [hasFocusCep, setHasFocusCep] = useState(false);
	const cepInputRef = useRef<HTMLInputElement>(null);
	const STEP_2_VALIDATE = fields.vehicleInfo.length > 6;
	const STEP_3_VALIDATE = state.fields.cep.length === 9 && !errors.cep;
	const cepAddressFormated = fields.address
		? `${fields.cep} - ${fields.address}`
		: cepMask(fields.cep);

	function handleInputValue(fieldName: keyof Fields, fieldValue: string) {
		dispatch({
			type: 'setFieldValue',
			fieldName: fieldName,
			payload: fieldValue,
		});
	}

	function handleFieldsValidation() {
		const vehicleInfoValidation = ValidationBuilder.field('vehicleInfo')
			.required()
			.build();
		const cepValidation = ValidationBuilder.field('cep')
			.cep()
			.required()
			.build();

		const validation = ValidationComposite.build([
			...vehicleInfoValidation,
			...(fields.vehicleInfo ? cepValidation : []),
		]);

		const fieldsValidation = [
			{ field: 'vehicleInfo', value: fields.vehicleInfo },
			...(fields.vehicleInfo ? [{ field: 'cep', value: fields.cep }] : []),
		];

		for (let i = 0; i < fieldsValidation.length; i++) {
			if (fieldsValidation[i].value) {
				dispatch({
					type: 'setErrors',
					fieldName: fieldsValidation[i].field as keyof Fields,
					payload: validation.validate(
						fieldsValidation[i].field,
						fieldsValidation[i].value,
					),
				});
			}
		}
	}

	function handleOnBlurCep() {
		cepInputRef?.current?.blur();
		setHasFocusCep(false);
	}

	function clearFields() {
		handleInputValue('cep', '');
		handleInputValue('vehicleInfo', '');
		dispatch({ type: 'setSelectedWorkshop', payload: null });
	}

	const { isPending: isLoading, mutateAsync: getWorkshops } = useMutation({
		mutationKey: ['@mutation:workshop'],
		mutationFn: async () => {
			const googleMapsResponse = await CepGoogleMapsService(state.fields.cep);
			const workshopResponse = await WorkshopByLatLngService(
				googleMapsResponse.lat,
				googleMapsResponse.lng,
			);

			dispatch({
				type: 'setFieldValue',
				fieldName: 'address',
				payload: googleMapsResponse.address,
			});
			dispatch({
				type: 'setLatLng',
				payload: {
					lat: googleMapsResponse.lat,
					lng: googleMapsResponse.lng,
				},
			});
			dispatch({
				type: 'setWorkshops',
				payload: workshopResponse,
			});

			handleOnBlurCep();

			return workshopResponse;
		},
		onError: (error) => {
			console.error(error);
			dispatch({
				type: 'setErrors',
				fieldName: 'cep',
				payload: 'CEP inválido ou não encontrado',
			});
		},
	});

	useEffect(() => {
		handleFieldsValidation();
	}, [state.fields]);

	useEffect(() => {
		if (state.fields.cep.length === 9) getWorkshops();
	}, [state.fields.cep]);

	useEffect(() => {
		const ACTIVE_BUTTON =
			!!state.fields.cep &&
			!!state.fields.vehicleInfo &&
			!!state.selectedWorkshop?.name;

		dispatch({
			type: 'setEnableButton',
			payload: ACTIVE_BUTTON,
		});
	}, [
		state.fields.cep,
		state.fields.vehicleInfo,
		state.selectedWorkshop?.name,
	]);

	useEffect(() => {
		clearFields();
	}, []);

	return (
		<>
			<div className="address-form">
				<Typography as="h2" variant="body1">
					1. Informe seu veículo
				</Typography>
				<Input.Root width="fluid" filled={!!fields.vehicleInfo}>
					<Input.Box>
						<Input.Label>Marca, modelo e ano de veículo</Input.Label>
						<Input.Field
							value={fields.vehicleInfo}
							onChange={(e) =>
								handleInputValue('vehicleInfo', sanitize(e.target.value))
							}
							onBlur={(e) => setVehicle(sanitize(e.target.value))}
							data-gtm-type="form"
							data-gtm-input="input"
							data-gtm-name="caps:oficina"
							data-gtm-subname="informe-seu-veiculo"
						/>
					</Input.Box>
					<Input.HelperText>Exemplo: Ford Ka 2018</Input.HelperText>
				</Input.Root>
				{STEP_2_VALIDATE && (
					<>
						<Typography as="h2" variant="body1">
							2. Informe seu CEP
						</Typography>
						<div>
							<Input.Root
								width="fluid"
								filled={!!fields.cep}
								error={!!errors.cep}
							>
								<Input.Box>
									<Input.Label>CEP</Input.Label>
									<Input.Field
										value={hasFocusCep ? fields.cep : cepAddressFormated}
										onChange={(e) =>
											handleInputValue('cep', cepMask(sanitize(e.target.value)))
										}
										onFocus={() => {
											setHasFocusCep(true);
										}}
										onBlur={() => handleOnBlurCep()}
										ref={cepInputRef}
										data-gtm-type="form"
										data-gtm-input="input"
										data-gtm-name="caps:oficina"
										data-gtm-subname="informe-seu-cep"
									/>
								</Input.Box>
								{!!errors.cep && (
									<Input.ErrorMessage>{errors.cep}</Input.ErrorMessage>
								)}
							</Input.Root>
							<SearchCep
								onCepChange={(value: string) =>
									handleInputValue('cep', sanitize(value))
								}
								titleModal="Pesquisa de CEP"
								subTitleModal="Todos os campos são obrigatórios"
								buttonLabel="Selecionar CEP"
							/>
						</div>
						{STEP_3_VALIDATE && (
							<WorkshopList
								state={state}
								dispatch={dispatch}
								isLoading={isLoading}
							/>
						)}
					</>
				)}
			</div>
		</>
	);
};
