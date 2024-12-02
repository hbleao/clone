'use client';
import { Button } from '@porto-ocean/button';
import { Grid } from '@porto-ocean/grid';
import * as Input from '@porto-ocean/input';
import { Row } from '@porto-ocean/row';
import { Typography } from '@porto-ocean/typography';
import { useMutation } from '@tanstack/react-query';

import { useEffect, useState } from 'react';

import './styles.scss';

import type { IAddress, IEligibility } from '@/dtos';

import { CardPrice } from '../CardPrice';
import { SearchCep } from '../SearchCep';
import { ModalAcquisitionFirstStep } from './ModalAcquisitionFirstStep';
import { NotificationCep } from './NotificationCep';

import { useUserStore } from '@/store';

import {
	ScopeAndEligibilityService,
	ServiceProductByProductAlias,
} from '@/services';

import { useDebounce, useScrollBlock } from '@/hooks';

import { cepMask, formatGtm, sanitize, setupDataLayer } from '@/utils';
import { useRouter } from 'next/navigation';
import type { SectionCepWithCardPriceProps } from './types';

export const SectionCepWithCardPrice = ({
	sectionTitle,
	buttonLabel,
	modal,
}: SectionCepWithCardPriceProps) => {
	const router = useRouter();
	const productStore = useUserStore((state) => state.user.product);
	const setProductUser = useUserStore((state) => state.setProductUser);
	const setAddressUser = useUserStore((state) => state.setAddressUser);
	const [blockScroll, allowScroll] = useScrollBlock();
	const [cep, setCep] = useState('');
	const cepServiceDebounce = useDebounce(cep, 700);
	const [isOpenProductModal, setIsOpenProductModal] = useState(false);
	const [showCepMessage, setShowCepMessage] = useState(false);
	const {
		data: productAlias,
		isPending: isLoadingProduct,
		mutateAsync: handleSelectCategory,
	} = useMutation({
		mutationKey: ['@mutation:product'],
		mutationFn: async () => {
			if (!productStore?.alias) return;

			return await ServiceProductByProductAlias({
				value: productStore.alias,
			});
		},
		onError: (error) => {
			window.dataLayer.push({
				event: 'alert',
				ev_action: 'ecommerce:visualizar:produto:alert',
				ev_label: error.message,
				alert_event: 'view_item',
				alert_type: 'erro',
				alert_code: error.name,
				error_service: 'ServiceProductByProductAlias',
				alert_service_message: 'Erro na busca do produto por categoria',
				client_id: '',
				client_bcp: '',
			});
		},
	});

	const {
		data: eligibility,
		isPending: isLoadingEligibility,
		isError: isErrorEligibility,
		mutateAsync: getEligibility,
	} = useMutation({
		mutationKey: ['@mutation:eligibility'],
		mutationFn: async () => {
			if (cep.length < 9) return;

			setShowCepMessage(false);

			return await ScopeAndEligibilityService({
				cep: cepServiceDebounce.replace('-', ''),
				partnerProductId: String(productAlias?.partnerProductId),
			});
		},
		onError: (error) => {
			setShowCepMessage(true);
			window.dataLayer.push({
				event: 'select_content',
				ev_action: 'verificar-disponibilidade-regiao:sucesso',
				method: 'etapa:pdp|tipo-consulta:cep',
				status: 'disponibilidade:servico-indisponivel',
			});
			window.dataLayer.push({
				event: 'alert',
				ev_action: `preencheu:${formatGtm(String(sectionTitle))}:alert`,
				ev_label: error?.message,
				alert_event: 'select_content',
				alert_type: 'error',
				alert_code: error?.name,
				error_service: 'ScopeAndEligibilityService',
				alert_service_message: error?.message,
				client_id: '',
				client_bcp: '',
			});
		},

		onSuccess: async (data: IEligibility) => {
			if (cep.length < 9) return;

			setAddressUser({
				cep: cepServiceDebounce,
				...data?.addressData,
			});

			setShowCepMessage(true);

			const gtmEventStatus = data.coverage
				? 'disponibilidade:servico-disponivel'
				: 'disponibilidade:servico-indisponivel';
			window.dataLayer.push({
				event: 'select_content',
				ev_action: 'verificar-disponibilidade-regiao:sucesso',
				method: 'etapa:pdp|tipo-consulta:cep',
				status: gtmEventStatus,
				ev_label: `localizacao:${formatGtm(data.addressData?.state)}|${formatGtm(data.addressData?.city)}|${formatGtm(data.addressData?.neighborhood)}`,
			});
		},
	});
	const buttonVariant = eligibility?.coverage ? 'insurance' : 'disabled';
	const inputVariant = productAlias?.cardPrice?.price ? 'enable' : 'disabled';
	const disableFieldCep = isLoadingProduct || inputVariant === 'disabled';

	function triggerGtmModalEvent(action: 'close' | 'open') {
		window.dataLayer.push({
			event: 'modal',
			action,
			name: 'selecione-as-opcoes',
		});
	}

	function triggerGtmViewItemEvent() {
		const itemCategory = productAlias?.categories?.category?.toLowerCase?.();

		if (!itemCategory) {
			return;
		}

		window.dataLayer.push({
			event: 'view_item',
			ev_action: 'ecommerce:visualizar:produto:sucesso',
			ev_detail: `categoria:${itemCategory}`,
			items: [
				{
					item_id: productAlias?.sku,
					item_name: 'servicos-para-casa-e-auto',
					item_category: productAlias?.alias,
					item_brand: 'porto',
					item_variant: '',
					price: productAlias?.cardPrice.price,
					quantity: 1,
					affiliation: 'porto',
				},
			],
		});
	}

	function handleProductsWithoutConfigPage() {
		setProductUser({
			...productAlias,
			selectedItems: [
				{
					sku: productAlias?.sku,
					id: productAlias?.id,
					description: productAlias?.name,
					label: productAlias?.name,
					partnerProductId: productAlias?.partnerProductId,
					serviceTypeId: productAlias?.serviceTypeId,
					chargeTypeId: 1,
					specialtyCode: productAlias?.specialtyCode,
					originCode: productAlias?.originCode,
					companyCode: productAlias?.companyCode,
					sourceSystemCode: productAlias?.sourceSystemCode,
					problem: productAlias?.problem,
					subject: productAlias?.subject,
					price: productAlias?.cardPrice.price,
					category: productAlias?.categories.category,
					subCategory: productAlias?.categories.subCategory,
					selected: true,
				},
			],
			sku: productAlias?.sku,
			cardPrice: {
				...productAlias?.cardPrice,
				price: productAlias?.cardPrice?.price,
			},
			companyCode: productAlias?.companyCode,
			id: productAlias?.id,
			originCode: productAlias?.originCode,
			partnerProductId: productAlias?.partnerProductId,
			problem: productAlias?.problem,
			serviceTypeId: productAlias?.serviceTypeId,
			sourceSystemCode: productAlias?.sourceSystemCode,
			specialtyCode: productAlias?.specialtyCode,
			subject: productAlias?.subject,
		});

		router.push('/loja/servicos/agendamento');
	}

	function handleToggleProductModal() {
		if (buttonVariant === 'disabled') return;
		setIsOpenProductModal((oldState) => !oldState);
		triggerGtmModalEvent(!isOpenProductModal ? 'open' : 'close');
	}

	useEffect(() => {
		handleSelectCategory();
		setupDataLayer();
	}, []);

	useEffect(() => {
		triggerGtmViewItemEvent();
	}, [productAlias]);

	useEffect(() => {
		if (cep.length < 8) return;
		getEligibility();
	}, [cepServiceDebounce]);

	useEffect(() => {
		if (isOpenProductModal) {
			setAddressUser({
				cep: cepServiceDebounce,
			});
			setProductUser({
				selectedItems: [],
				id: 0,
				coupon: '',
				serviceTypeId: 0,
				sourceSystemCode: '',
				subject: productAlias?.subject,
				...productAlias,
				cardPrice: {
					...productAlias?.cardPrice,
				},
			});

			blockScroll();
			return;
		}

		allowScroll();

		return () => allowScroll();
	}, [isOpenProductModal]);

	const isProductWithoutConfigPage = !productAlias?.items?.length;

	return (
		<Grid className="section-cep-with-card-price">
			<Row landscape={[1, 7]} desktop={[1, 7]} wide={[1, 7]}>
				<Typography
					as="h2"
					variant="title4"
					color="black75"
					className="section-cep-with-card-price__title"
				>
					{sectionTitle}
				</Typography>

				<div className="section-cep-with-card-price__box_input">
					<Input.Root
						width="fluid"
						filled={!!cep}
						variant="default"
						disabled={disableFieldCep}
						className="section-cep-with-card-price__input"
					>
						<Input.Box>
							<Input.Label>CEP</Input.Label>
							<Input.Field
								value={cep}
								onChange={(e) => setCep(cepMask(sanitize(e.target.value)))}
								data-gtm-type="form"
								data-gtm-form="input"
								data-gtm-name={`porto-servico:${productAlias?.alias}`}
								data-gtm-subname={`${productAlias?.alias}:${formatGtm(String(sectionTitle))}:cep`}
							/>
							{isLoadingEligibility && <span className="btn-loader" />}
						</Input.Box>
					</Input.Root>
					<SearchCep
						onCepChange={(value: string) => setCep(sanitize(value))}
						{...modal}
						data-gtm-type="click"
						data-gtm-clicktype="button"
						data-gtm-name={`porto-servico:${productAlias?.alias}`}
						data-gtm-subname={`${productAlias?.alias}:${formatGtm(String(sectionTitle))}:nao-sei-o-cep`}
					/>
				</div>
				{showCepMessage && (
					<NotificationCep
						cep={cepServiceDebounce}
						address={eligibility?.addressData as IAddress}
						coverage={!!eligibility?.coverage}
						error={isErrorEligibility}
					/>
				)}
				<Button
					variant={buttonVariant}
					width="fluid"
					onClick={
						isProductWithoutConfigPage
							? handleProductsWithoutConfigPage
							: handleToggleProductModal
					}
					data-gtm-type="click"
					data-gtm-clicktype="button"
					data-gtm-name={`porto-servico:${productAlias?.alias}`}
					data-gtm-subname={`${productAlias?.alias}:${formatGtm(String(sectionTitle))}:${formatGtm(String(buttonLabel))}`}
				>
					{buttonLabel}
				</Button>
			</Row>

			<Row landscape={[7, 13]} desktop={[7, 13]} wide={[7, 13]}>
				<CardPrice {...productAlias?.cardPrice} />
			</Row>
			{isOpenProductModal && (
				<ModalAcquisitionFirstStep
					handleCloseModal={handleToggleProductModal}
					allowScroll={allowScroll}
				/>
			)}
		</Grid>
	);
};
