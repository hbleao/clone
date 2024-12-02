'use client';
import { Button } from '@porto-ocean/button';
import { Icon } from '@porto-ocean/icon';
import { useState } from 'react';

import { ShimmerDesktop } from '@/components/CardResume/Shimmer/ShimmerDesktop';
import { ShimmerMobile } from '@/components/CardResume/Shimmer/ShimmerMobile';
import * as Card from '@/components/CardResume/modules';

import { usePageStore, useUserStore } from '@/store';

import { formatGtm, formattedPrice, getStepParam } from '@/utils';

import type { CardResumeCaps } from '@/components/CardResume/types';

export const CardResume = ({
	scheduleState,
	isEnableButton,
	handleNextStep,
	isLoading = false,
	isLoadingButton = false,
}: CardResumeCaps) => {
	const [user, product] = useUserStore((state) => [
		state.user,
		state.user.product,
	]);

	const page = usePageStore((state) => state.page);
	const [isOpen, setIsOpen] = useState(false);
	const step = getStepParam(page.steps);
	const HAS_WORKSHOP = !!user.workshopSelected.name;

	const onToggle = () => {
		setIsOpen(!isOpen);
	};

	function getFormattedDate() {
		return user.appointment.serviceDateTime?.split(' ')[0];
	}

	function getAddressFormated() {
		const workshop = user.workshopSelected;
		return `${workshop.address} - ${workshop.district}<br /> ${workshop.zipCode} - ${workshop.city}/${workshop.state}`;
	}

	const productCardPrice = product?.cardPrice as {
		price: number;
		oldPrice: number;
		instalmentText: string;
		discount: string;
	};

	return (
		<Card.Root isOpen={isOpen}>
			<Card.BottomBar>
				{isLoading ? (
					<ShimmerMobile />
				) : (
					<>
						{isOpen && <div className="overlay" />}
						<div
							className="card-resume__action"
							onClick={onToggle}
							onKeyDown={onToggle}
						>
							<Card.Price
								price={formattedPrice(Number(product?.cardPrice?.price))}
								legend={product?.cardPrice?.instalmentText}
							/>
							<Icon iconName="icon-porto-ic-short-arrow-up" size="text-md" />
						</div>
						{!isOpen && (
							<Button
								onClick={() => handleNextStep(step.nextLink)}
								disabled={!isEnableButton}
								variant={isEnableButton ? 'insurance' : 'disabled'}
								data-gtm-type="click"
								data-gtm-clicktype="button"
								data-gtm-name={`porto-servico:${step.tag?.name}`}
								data-gtm-subname={`${step.tag?.subname}:continuar`}
							>
								Continuar
							</Button>
						)}
					</>
				)}
			</Card.BottomBar>
			<Card.Body>
				{isLoading ? (
					<ShimmerDesktop />
				) : (
					<>
						<Card.Header onToggle={onToggle} open={isOpen} />

						<div className="card-resume__content">
							<Card.ServiceTitle
								icon="icon-porto-ic-wrench-tool"
								variantSub="body2"
								title={product?.categories?.category ?? ''}
								subTitle={product?.categories?.subCategory}
								as="p"
							/>

							<div>
								<Card.ServiceTitle
									variant="caption"
									icon="icon-porto-ic-magnifier-glass"
									title="Pedido de avaliação"
								/>
								<Card.ServiceItem
									title={product?.selectedItems?.[0]?.subCategory}
									items={
										product?.selectedItems?.map?.((item) => item.label) || []
									}
									price={formattedPrice(Number(product?.cardPrice?.oldPrice))}
									variant="caption"
								/>
							</div>

							{user.vehicle && (
								<Card.ServiceTitle
									icon="icon-porto-ic-car-front"
									variant="caption"
									variantSub="caption"
									title="Veículo"
									subTitle={user.vehicle}
									as="p"
								/>
							)}

							{HAS_WORKSHOP && (
								<Card.ServiceTitle
									icon="icon-porto-ic-car-carro-facil"
									variant="caption"
									variantSub="caption"
									title={`Oficina ${user.workshopSelected.name}`}
									subTitle={getAddressFormated()}
									as="p"
								/>
							)}

							{!!user.appointment.day && (
								<Card.ServiceTitle
									icon="icon-porto-ic-calendar"
									variant="caption"
									variantSub="caption"
									title="Data e período"
									subTitle={`${getFormattedDate()}  ${user.appointment.time ? `- ${user.appointment.time}` : ''}`}
									as="p"
								/>
							)}
						</div>

						<div className="card-resume__divisor" />
						<Card.FooterBar
							text="A partir de"
							totalPrice={formattedPrice(productCardPrice.price)}
							legend={productCardPrice.instalmentText}
						>
							<Button
								onClick={() => {
									handleNextStep(step.nextLink);
									step.index === 0 &&
										window.dataLayer.push({
											event: 'select_content',
											ev_action: 'agendamento:sucesso',
											ev_label: 'tempo-estimado-expirar:15-minutos',
											ev_detail: `servico-selecionado:${product?.selectedItems?.map((item) => formatGtm(item.label)).join(',')}`,
											service_hour: scheduleState.selectedHour,
											service_date: `${scheduleState.selectedDate.weekday} - ${scheduleState.selectedDate.day} - ${scheduleState.selectedDate.month}`,
											product: 'servico-para-casa-e-auto',
											subproduct: formatGtm(
												String(product?.categories?.category),
											),
											value: productCardPrice?.price,
										});
									step.index === 2 &&
										window.dataLayer.push({
											event: 'promo_mkt_communication',
											ev_action: `receber-comunicacoes:${user.personalData.mktCommunication ? 'sim' : 'nao'}:sucesso`,
											ev_label: 'pf',
											client_id: '',
											client_bcp: '',
										});
								}}
								disabled={!isEnableButton}
								variant={isEnableButton ? 'insurance' : 'disabled'}
								width="fluid"
								data-gtm-type="click"
								data-gtm-clicktype="button"
								data-gtm-name={`porto-servico:${step.tag?.name}`}
								data-gtm-subname={`${step.tag?.subname}:continuar`}
								isLoading={isLoadingButton}
							>
								Continuar
							</Button>
						</Card.FooterBar>
					</>
				)}
			</Card.Body>
		</Card.Root>
	);
};
