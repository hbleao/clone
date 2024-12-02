'use client';

import * as Checkbox from '@/components/Checkbox';
import { Textarea } from '@/components/Textarea';
import { useUserStore } from '@/store';
import { Button } from '@porto-ocean/button';
import { useEscapeKey } from '@porto-ocean/hooks';
import { Icon } from '@porto-ocean/icon';
import * as Modal from '@porto-ocean/modal';
import { Typography } from '@porto-ocean/typography';
import { joinClasses } from '@porto-ocean/utils';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { type TServicesMock, mock } from './mock';
import './styles.scss';

export const ModalServices = ({ isOpen, onClose }) => {
	const [allowContinue, setAllowContinue] = useState(false);
	const [selectedServices, setSelectedServices] = useState({});
	const { setProductUser } = useUserStore();
	const router = useRouter();

	useEscapeKey(() => onClose());

	const isCheckboxDisabled = (
		label: string,
		type: string,
		selectedServices: TServicesMock['services'] | object,
		allServices: TServicesMock['services'],
	) => {
		if (selectedServices[label] && type === 'only') {
			return false;
		}

		const hasOnlySelected = Object.keys(selectedServices).some(
			(key) =>
				selectedServices[key] &&
				allServices.find((service) => service.label === key)?.type === 'only',
		);

		return hasOnlySelected;
	};

	const handleChange = useCallback(
		({ target }, type = '', isTextarea = false) => {
			setSelectedServices((curr) => {
				const isChecked = !!curr[target.id];

				if (isTextarea) {
					return {
						...curr,
						[target.id]: { ...curr[target.id], label: target.value },
					};
				}

				if (isChecked) {
					return Object.fromEntries(
						Object.entries(curr).filter(([key]) => key !== target.id),
					);
				}

				if (type === 'only') {
					return { [target.id]: { checked: true, label: target.id } };
				}

				return { ...curr, [target.id]: { checked: true, label: target.id } };
			});
		},
		[],
	);

	const handleContinue = () => {
		const servicesSelected = Object.values(selectedServices)
			.filter((service: { label: string }) => service.label)
			.map((service: object) => ({
				...service,
				category: 'Serviço automotivo',
			}));

		if (servicesSelected.length === 0) return;

		setProductUser({ selectedItems: servicesSelected });
		router.push('/loja/centro-automotivo/oficinas');
	};

	const handleAllowButton = () => {
		const hasSelectedServices = Object.keys(selectedServices).length > 0;
		if (hasSelectedServices) {
			return setAllowContinue(true);
		}

		setAllowContinue(false);
	};

	useEffect(() => {
		handleAllowButton();
	}, [selectedServices]);

	if (!isOpen) return null;

	return (
		<>
			<Modal.Overlay />
			<Modal.Root className="modal-caps-service">
				<Modal.Content>
					<Modal.Header>
						<Modal.ContentIconClose
							onClick={() => {
								onClose();
								window.dataLayer.push({
									event: 'dialog',
									action: 'close',
									name: 'que-tal-aproveitar-a-visita-e-avaliar-outros-itens',
								});
							}}
						>
							<Icon size="text-md" iconName="icon-porto-ic-close" />
						</Modal.ContentIconClose>
						<div className="modal-caps-service__header">
							<Modal.ContentTitle>{mock.title}</Modal.ContentTitle>
						</div>
					</Modal.Header>
					<Modal.Body>
						{mock.services.map((service) => {
							const hasTextArea = service?.node?.component === 'textarea';
							const hasDescription = !!service.description;

							const isDisabled = isCheckboxDisabled(
								service.label,
								String(service.type),
								selectedServices,
								mock.services,
							);

							return (
								<>
									<Checkbox.Root
										key={service.label}
										variant={
											selectedServices[service.label] ? 'checked' : 'default'
										}
										aria-disabled={isDisabled}
										className={joinClasses([
											hasTextArea ? '--no-margin' : '',
											isDisabled ? 'disabled' : '',
										])}
										onClick={(e) => handleChange(e, service.type)}
									>
										<Checkbox.Input id={service.label} />
										<div className="modal-caps-service__checkbox-container">
											<Checkbox.Label>
												<strong>{service.label}</strong>
											</Checkbox.Label>
											{hasDescription && (
												<Typography as="p" variant="body2">
													{service.description}
												</Typography>
											)}
										</div>
									</Checkbox.Root>
									{hasTextArea && (
										<Textarea
											label=""
											maxChars={200}
											rows="5"
											placeholder={String(service.node?.placeholder)}
											disabled={isDisabled}
											onChange={(value) =>
												handleChange(
													{ target: { value, id: service.label } },
													service.type,
													true,
												)
											}
										/>
									)}
								</>
							);
						})}
						<Button
							width="fluid"
							onClick={handleContinue}
							variant={allowContinue ? 'insurance' : 'disabled'}
							data-gtm-type="click"
							data-gtm-clicktype="modal-button"
							data-gtm-name="que-tal-aproveitar-a-visita-e-avaliar-outros-itens "
							data-gtm-subname="continuar"
						>
							Continuar
						</Button>
					</Modal.Body>
				</Modal.Content>
			</Modal.Root>
		</>
	);
};
