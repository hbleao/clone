'use client';

import { Button } from '@porto-ocean/button';
import { Icon } from '@porto-ocean/icon';
import * as Input from '@porto-ocean/input';
import * as Modal from '@porto-ocean/modal';
import { Typography } from '@porto-ocean/typography';
import { useEffect } from 'react';

import { PORTO_BANK_CEP_MOCK, useModalCep } from './useModalCep';

import { useGeolocation } from '@/hooks/useGeolocation';
import { sanitize } from '@/utils';

export const ModalCep = ({ onClose }) => {
	const { inputValue, handleValidateCep, status, handleChange, reset } =
		useModalCep();
	const { requestGeolocation, coordinates } = useGeolocation();

	useEffect(() => {
		if (coordinates?.latitude) {
			handleChange({ target: { value: PORTO_BANK_CEP_MOCK } });
			handleValidateCep(PORTO_BANK_CEP_MOCK);
		}
	}, [coordinates]);

	const shouldDisableGeoLocationButton = !!coordinates?.latitude;

	return (
		<>
			<Modal.Overlay />
			<Modal.Root className="modal-showcase-cep">
				<Modal.Content>
					<Modal.Header>
						<Modal.ContentIconClose
							data-gtm-type="click"
							data-gtm-clicktype="button"
							data-gtm-subname="fechar"
							onClick={onClose}
						>
							<Icon size="text-md" iconName="icon-porto-ic-close" />
						</Modal.ContentIconClose>
						<div className="modal-showcase-cep__header">
							<Modal.ContentTitle variant="title6">
								Informe onde o serviço será feito
							</Modal.ContentTitle>
						</div>
					</Modal.Header>
					<Modal.Body>
						<div className="modal-showcase-cep__body">
							<Input.Root width="fluid" variant="default">
								<Input.Box className={`--${status || ''}`}>
									<Input.Field
										onChange={(e) =>
											handleChange({ target: sanitize(e.target.value) })
										}
										value={inputValue}
										onBlur={() => handleValidateCep(inputValue)}
										required
									/>
									<Input.Label>CEP</Input.Label>
									{inputValue && (
										<Icon
											className="modal-showcase-cep__close-icon"
											iconName="icon-porto-ic-circle-close"
											size="text-lg"
											onClick={reset}
										/>
									)}
								</Input.Box>
								{status === 'not-found' && (
									<Input.HelperText>
										CEP não encontrado. Tente novamente.
									</Input.HelperText>
								)}
							</Input.Root>
							<Typography
								as="p"
								variant="body2"
								style={{ textAlign: 'center' }}
							>
								ou
							</Typography>
							<Button
								width="fluid"
								variant={
									shouldDisableGeoLocationButton ? 'disabled' : 'insurance'
								}
								styles="secondary"
								onClick={requestGeolocation}
								disabled={shouldDisableGeoLocationButton}
								className="modal-showcase-cep__btn-geolocation"
							>
								<Icon
									iconName="icon-porto-ic-pin-location"
									size="text-2xl"
									color="$portoSeguro"
								/>
								Acessar localização
							</Button>
						</div>
						<div className="modal-showcase-cep__footer">
							<Button
								width="fluid"
								variant="insurance"
								styles="primary"
								onClick={onClose}
							>
								Continuar
							</Button>
							<Button
								width="fluid"
								variant="insurance"
								styles="ghost"
								onClick={onClose}
							>
								Continuar sem localização
							</Button>
						</div>
					</Modal.Body>
				</Modal.Content>
			</Modal.Root>
		</>
	);
};
