'use client';
import { Button } from '@porto-ocean/button';
import { Icon } from '@porto-ocean/icon';
import { useState } from 'react';

import { ShimmerDesktop } from '@/components/CardResume/Shimmer/ShimmerDesktop';
import { ShimmerMobile } from '@/components/CardResume/Shimmer/ShimmerMobile';
import * as Card from '@/components/CardResume/modules';

import { usePageStore, useUserStore } from '@/store';

import { formatGtm, formattedPrice, getStepParam } from '@/utils';

import type { CardResumeDefault } from '@/components/CardResume/types';

export const CardResume = ({
	scheduleState,
	isEnableButton,
	handleNextStep,
	isLoading = false,
}: CardResumeDefault) => {
	const [user, product] = useUserStore((state) => [
		state.user,
		state.user.product,
	]);

	const page = usePageStore((state) => state.page);
	const [isOpen, setIsOpen] = useState(false);
	const step = getStepParam(page.steps);
	const fullAddress = user.address.complement
		? `, ${user.address.number ? `${user.address.number} - ` : ''} ${user.address.complement}`
		: '';

	const onToggle = () => {
		setIsOpen(!isOpen);
	};

	const tagStep = {
		'0': {
			name: 'agendamento',
			subname: 'selecione-o-dia-e-horario',
		},
		'1': {
			name: 'local-do-servico',
			subname: 'confirme-onde-o-servico-sera-realizado',
		},
		'2': {
			name: 'dados-cadastrais',
			subname: 'informe-seus-dados',
		},
	};

	function getFormattedDate() {
		return user.appointment.serviceDateTime?.split(' ')[0];
	}

	const productCardPrice = product?.cardPrice as {
		price: number;
		oldPrice: number;
		instalmentText: string;
		discount: string;
	};

	const stepIndex = step?.index as number;

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
								data-gtm-name={`porto-servico:${tagStep[stepIndex].name}`}
								data-gtm-subname={`${tagStep[stepIndex].subname}:continuar`}
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
						<Card.ServiceTitle title={product?.selectedItems?.[0]?.category} />
						<Card.ServiceItem
							title={product?.selectedItems?.[0]?.subCategory}
							items={product?.selectedItems?.map?.((item) => item.label) || []}
							price={formattedPrice(Number(product?.cardPrice?.oldPrice))}
						/>
						<Card.Address
							address={`${user.address.cep} - ${user.address.street}${fullAddress}`}
						/>
						{!!user.appointment.day && (
							<Card.Schedule
								date={`${getFormattedDate()}  ${user.appointment.time ? `- ${user.appointment.time}` : ''}`}
							/>
						)}
						{product?.isValidCoupon && (
							<Card.Discount
								discountText={`Cupom de ${productCardPrice.discount}% OFF`}
								discountValue={`${formattedPrice(productCardPrice.price - productCardPrice.oldPrice)}`}
							/>
						)}
						<div className="card-resume__divisor" />
						<Card.FooterBar
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
								data-gtm-name={`porto-servico:${tagStep[stepIndex].name}`}
								data-gtm-subname={`${tagStep[stepIndex].subname}:continuar`}
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
