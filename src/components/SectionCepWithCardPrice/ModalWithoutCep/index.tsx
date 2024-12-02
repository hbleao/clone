'use client';

import { Button } from '@porto-ocean/button';
import * as Dropdown from '@porto-ocean/dropdown';
import { Icon } from '@porto-ocean/icon';
import * as Input from '@porto-ocean/input';
import * as Modal from '@porto-ocean/modal';
import { Typography } from '@porto-ocean/typography';
import { useEffect, useReducer } from 'react';

import './styles.scss';

import { withoutCepReducer } from './reducer/index';
import { initialState } from './reducer/initialState';

import { PostalCepService } from '@/services/postalCepService';
import { PostalGuideService } from '@/services/postalGuideService';
import { PostalStatesService } from '@/services/postalStatesService';
import { useUserStore } from '@/store';

import * as Radio from '@/components/Radio';

import { useDebounce } from '@/hooks/useDebounce';

import { sanitize } from '@/utils';
import { useEscapeKey } from '@porto-ocean/hooks';

import type { CepProps, ModalWithoutCepProps, StateProps } from './types';

export const ModalWithoutCep = ({
	modal,
	handleCloseModal,
	handleCallBackCep,
}: ModalWithoutCepProps) => {
	const [state, dispatch] = useReducer(withoutCepReducer, initialState);
	const handleStreet = useDebounce(state.fields.street, 700);
	const buttonVariant = state.disabledFields.button ? 'disabled' : 'insurance';
	const setAddressUser = useUserStore((state) => state.setAddressUser);
	useEscapeKey(() => handleCloseModal());

	function handleStates() {
		dispatch({ type: 'setLoadingValue', fieldName: 'state', payload: true });
		dispatch({
			type: 'setErrors',
			fieldName: 'state',
			payload: false,
		});
		PostalStatesService()
			.then((data) => {
				dispatch({
					type: 'setFieldValue',
					fieldName: 'availableStates',
					payload: data.estados,
				});
			})
			.catch(() => {
				dispatch({
					type: 'setErrors',
					fieldName: 'state',
					payload: true,
				});
			})
			.finally(() => {
				dispatch({
					type: 'setLoadingValue',
					fieldName: 'state',
					payload: false,
				});
			});
	}

	function handleSelectState(item: StateProps) {
		dispatch({
			type: 'setFieldValue',
			fieldName: 'selectedState',
			payload: { ...item },
		});
		dispatch({
			type: 'setDropdownField',
			fieldName: 'state',
			payload: false,
		});
		dispatch({
			type: 'setErrors',
			fieldName: 'city',
			payload: false,
		});
		dispatch({ type: 'setLoadingValue', fieldName: 'city', payload: true });
		dispatch({ type: 'setDisabledField', fieldName: 'city', payload: true });
		dispatch({ type: 'setDisabledField', fieldName: 'street', payload: true });
		dispatch({ type: 'setFieldValue', fieldName: 'selectedCity', payload: '' });
		PostalGuideService(item.siglaEstado)
			.then((data) => {
				dispatch({
					type: 'setFieldValue',
					fieldName: 'availableCities',
					payload: data,
				});
				dispatch({
					type: 'setFieldValue',
					fieldName: 'filteredCities',
					payload: data,
				});
				dispatch({
					type: 'setDisabledField',
					fieldName: 'city',
					payload: false,
				});
			})
			.catch(() => {
				dispatch({
					type: 'setErrors',
					fieldName: 'city',
					payload: true,
				});
			})
			.finally(() => {
				dispatch({
					type: 'setLoadingValue',
					fieldName: 'city',
					payload: false,
				});
				dispatch({
					type: 'setDisabledField',
					fieldName: 'city',
					payload: false,
				});
			});
	}

	function handleCityFilterChange(e) {
		dispatch({
			type: 'setFieldValue',
			fieldName: 'selectedCity',
			payload: e,
		});
		dispatch({
			type: 'setFieldValue',
			fieldName: 'filteredCities',
			payload: state.fields.availableCities.filter((city) =>
				city.toLowerCase().includes(e.toLowerCase()),
			),
		});
	}

	function handleCep() {
		if (state.fields.street === '') return;
		dispatch({ type: 'setLoadingValue', fieldName: 'street', payload: true });
		dispatch({
			type: 'setErrors',
			fieldName: 'street',
			payload: false,
		});
		PostalCepService(
			state.fields.selectedState.siglaEstado,
			state.fields.selectedCity,
			state.fields.street,
		)
			.then((data) => {
				const updatedCepResult = data.logradouros.map((logradouro) => ({
					...logradouro,
					isChecked: false,
				}));
				dispatch({
					type: 'setFieldValue',
					fieldName: 'cepList',
					payload: updatedCepResult,
				});
			})
			.catch(() => {
				dispatch({
					type: 'setErrors',
					fieldName: 'street',
					payload: true,
				});
			})
			.finally(() => {
				dispatch({
					type: 'setLoadingValue',
					fieldName: 'street',
					payload: false,
				});
			});
	}

	function handleRadio(index) {
		const updatedCepResult = state.fields.cepList.map((item, i) => {
			return {
				...item,
				isChecked: i === index,
			};
		});
		dispatch({
			type: 'setFieldValue',
			fieldName: 'cepList',
			payload: updatedCepResult,
		});

		setAddressUser(state.fields.cepList[index]);

		dispatch({
			type: 'setDisabledField',
			fieldName: 'button',
			payload: false,
		});
	}

	function handleSelectedCity(city: string) {
		dispatch({
			type: 'setFieldValue',
			fieldName: 'selectedCity',
			payload: city,
		});
		dispatch({
			type: 'setDropdownField',
			fieldName: 'city',
			payload: !state.dropdowns.city,
		});
		dispatch({ type: 'setDisabledField', fieldName: 'street', payload: false });
	}

	useEffect(() => {
		handleCep();
	}, [handleStreet]);

	useEffect(() => {
		handleStates();
	}, []);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				handleCloseModal();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<>
			<Modal.Overlay />
			<Modal.Root className="modal-without-cep">
				<Modal.Content>
					<Modal.Header>
						<Modal.ContentIconClose
							onClick={handleCloseModal}
							data-gtm-type="click"
							data-gtm-clicktype="button"
							data-gtm-name={`${modal.titleModal}`}
							data-gtm-subname="fechar"
						>
							<Icon size="text-md" iconName="icon-porto-ic-close" />
						</Modal.ContentIconClose>
						<div className="modal-without-cep__header">
							<Modal.ContentTitle>{modal.titleModal}</Modal.ContentTitle>

							<Typography as="h5" variant="body2" color="black70">
								{modal.subTitleModal}
							</Typography>
						</div>
					</Modal.Header>
					<Modal.Body>
						<div>
							<Dropdown.Root
								filled={!!state.fields.selectedState.siglaEstado}
								error={state.errors.state}
							>
								<Dropdown.Trigger
									onClick={() => {
										dispatch({
											type: 'setDropdownField',
											fieldName: 'state',
											payload: !state.dropdowns.state,
										});
										state.errors.state && handleStates();
									}}
								>
									<Dropdown.Label>Estado / UF</Dropdown.Label>
									<Dropdown.Field
										value={state.fields.selectedState.siglaEstado}
									/>
									{state.loadings.state && <span className="btn-loader" />}
									{!state.loadings.state && (
										<Dropdown.Icon rotate={state.dropdowns.state} />
									)}
								</Dropdown.Trigger>
								{state.dropdowns.state && (
									<Dropdown.List>
										{state.fields.availableStates?.map((item: StateProps) => (
											<Dropdown.Item
												key={item.codigoEstado}
												onClick={() => {
													handleSelectState(item);
												}}
											>
												{item.siglaEstado}
											</Dropdown.Item>
										))}
									</Dropdown.List>
								)}
							</Dropdown.Root>
							{state.errors.state && (
								<Dropdown.ErrorMessage>
									Serviço indisponivel no momento.
								</Dropdown.ErrorMessage>
							)}
						</div>
						<div>
							<Dropdown.Root
								filled={!!state.fields.selectedCity}
								disabled={state.disabledFields.city}
								error={state.errors.city}
							>
								<Dropdown.Trigger
									onClick={() =>
										dispatch({
											type: 'setDropdownField',
											fieldName: 'city',
											payload: !state.dropdowns.city,
										})
									}
								>
									<Dropdown.Label>Cidade</Dropdown.Label>
									<Dropdown.Field
										value={state.fields.selectedCity}
										readOnly={false}
										onChange={(e) => handleCityFilterChange(e.target.value)}
									/>
									{state.loadings.city && <span className="btn-loader" />}
									{!state.loadings.city && (
										<Dropdown.Icon rotate={state.dropdowns.city} />
									)}
								</Dropdown.Trigger>

								{state.dropdowns.city && (
									<Dropdown.List>
										{state.fields.filteredCities.map((item: any) => (
											<Dropdown.Item
												key={item}
												onClick={() => {
													handleSelectedCity(item);
												}}
											>
												{item}
											</Dropdown.Item>
										))}
									</Dropdown.List>
								)}
							</Dropdown.Root>
							{state.errors.city && (
								<Dropdown.ErrorMessage>
									Serviço indisponivel no momento.
								</Dropdown.ErrorMessage>
							)}
						</div>
						<Input.Root
							width="fluid"
							variant="default"
							disabled={state.disabledFields.street}
							filled={!!state.fields.street}
							error={!!state.errors.street}
						>
							<Input.Box>
								<Input.Label>Rua, avenida, alameda</Input.Label>
								<Input.Field
									onChange={(e) => {
										dispatch({
											type: 'setFieldValue',
											fieldName: 'street',
											payload: sanitize(e.target.value),
										});
									}}
								/>
								{state.loadings.street && <span className="btn-loader" />}
							</Input.Box>
							<Input.HelperText>
								Ex: Rio Branco (somente o nome)
							</Input.HelperText>
							{state.errors.street && (
								<Input.ErrorMessage>
									Informe um logradouro válido
								</Input.ErrorMessage>
							)}
						</Input.Root>
						{state.fields.cepList.length > 0 && (
							<Typography as="h5" variant="title6" color="black100">
								Resultados:
							</Typography>
						)}
						{state.fields.cepList.length > 0 &&
							state.fields.cepList.map((item: CepProps, index) => (
								<Radio.Root
									variant={item.isChecked ? 'checked' : 'default'}
									key={item.codigoLogradouro}
								>
									<Radio.Input
										onClick={() => {
											handleRadio(index);
											handleCallBackCep(
												`${item.numeroCepLogradouro}-${item.numeroCepComplementoLogradouro}`,
											);
										}}
									/>
									<div className="modal-without-cep__radio-box">
										{item?.nomeLogradouro && (
											<Radio.Label variant="body2" as="span">
												{item.nomeLogradouro}
											</Radio.Label>
										)}
										{item?.bairro?.nomeBairro && (
											<Radio.Label variant="body2" as="span">
												{item.bairro.nomeBairro}
											</Radio.Label>
										)}
										{item?.localidade?.estado?.siglaEstado && (
											<Radio.Label variant="body2" as="span">
												{item.localidade.estado.siglaEstado}
											</Radio.Label>
										)}
										{item?.numeroCepComplementoLogradouro && (
											<Radio.Label variant="body2" weight="bold" as="span">
												{item.numeroCepLogradouro}-
												{item.numeroCepComplementoLogradouro}
											</Radio.Label>
										)}
									</div>
								</Radio.Root>
							))}
						<div>
							<Button
								width="fluid"
								variant={buttonVariant}
								styles="primary"
								key={modal.buttonLabel}
								onClick={handleCloseModal}
							>
								{modal.buttonLabel}
							</Button>
						</div>
					</Modal.Body>
				</Modal.Content>
			</Modal.Root>
		</>
	);
};
