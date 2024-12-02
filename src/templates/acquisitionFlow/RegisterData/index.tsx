'use client';
import { Typography } from '@porto-ocean/typography';
import { env } from 'next-runtime-env';
import { useRouter } from 'next/navigation';
import { useEffect, useReducer, useState } from 'react';
import { useCookies } from 'react-cookie';

import './styles.scss';

import { DialogSocialName } from './DialogSocialName';
import { FormRegisterData } from './FormRegisterData';
import { ModalReminderList } from './ModalReminderList';
import { DialogError } from './ModalReminderList/DialogError';
import { registerFormReducer } from './reducer';
import { initialState } from './reducer/initialState';

import { ProposalService } from '@/services';
import { usePageStore, useUserStore } from '@/store';

import { CardResume, SectionCustomData } from '@/components';

import { useScrollBlock } from '@/hooks';
import { encryptValue, onlyNumbers } from '@/utils';
import { generateSessionId } from '@/utils/generateSessionId/generateSessionId';
import { removeSpecialCharacters } from '@/validation/helpers';
import { removeNonDigits } from '@/validation/helpers/removeNonDigits';
import { ModalRescheduling } from './ModalRescheduling';

import type { AcquisitionFlowRegisterDataProps } from './types';

import { WorkshopFinalizeAppointment } from '@/services/workshopFinalizeAppointment';
import type { WorkshopAppointment } from '@/services/workshopFinalizeAppointment/types';

export function AcquisitionFlowRegisterData({
	variant,
}: AcquisitionFlowRegisterDataProps) {
	const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
	const pageConfig = usePageStore((state) => state.page);
	const router = useRouter();
	const {
		address,
		personalData,
		product,
		appointment,
		workshopSelected,
		vehicle,
	} = useUserStore((state) => state.user);
	const setAppointmentUser = useUserStore((state) => state.setAppointmentUser);
	const [_, setCookie, removeCookie] = useCookies([
		'shopping_token',
		'nom_enc_sms',
		'tax_enc_sms',
		'em_enc_sms',
		'sid_enc_sms',
		'mob_enc_sms',
	]);
	const [state, dispatch] = useReducer(registerFormReducer, initialState);
	const {
		fields,
		reminderList,
		isEnableSubmitButton,
		isEnableModalButton,
		refusedOption,
	} = state;
	const [step] = pageConfig.steps.filter(
		(step) => step.routeParam === 'dados-cadastrais',
	);
	const [blockScroll, allowScroll] = useScrollBlock();
	const cartCookieDomain = env('NEXT_PUBLIC_CART_COOKIE_DOMAIN');
	const cartUrl = `${env('NEXT_PUBLIC_PROPOSAL_BASE_PATH')}${pageConfig.steps[2].nextLink}`;
	const sessionId = generateSessionId(
		String(env('NEXT_PUBLIC_ORGANIZATION_ID')),
	);

	function removeAllCookies() {
		removeCookie('shopping_token', { path: '/' });
		removeCookie('nom_enc_sms', { path: '/' });
		removeCookie('tax_enc_sms', { path: '/' });
		removeCookie('em_enc_sms', { path: '/' });
		removeCookie('sid_enc_sms', { path: '/' });
		removeCookie('mob_enc_sms', { path: '/' });
		window.sessionStorage.removeItem('shopping_token');
	}

	function sendLeadGtmEvent(leadId = '') {
		window.dataLayer.push({
			event: 'lead',
			ev_action: 'tipo-contato:padrao:sucesso',
			ev_label: 'tipo-pessoa:pf',
			lead_id: leadId,
			client_id: encryptValue(removeSpecialCharacters(personalData.cpf)),
			client_bcp: '',
		});
	}

	function redirectToCart(url: string) {
		setTimeout(() => {
			return window.open(url, '_self');
		}, 300);
	}

	function handleNextStep(url: string) {
		if (variant === 'caps') return handleNextStepCaps(url);
		dispatch({ type: 'setIsOpenModal', payload: true });
		dispatch({ type: 'setUrl', payload: url });
	}

	function formatServiceDateTime(serviceDateTime: string): string {
		const datePart = serviceDateTime.split(' ')[0];
		const [day, month, year] = datePart.split('/').map(Number);
		const date = new Date(year, month - 1, day);
		const formattedDate = date.toISOString().split('T')[0];
		return formattedDate;
	}

	async function handleNextStepCaps(url: string) {
		setIsLoadingButton(true);
		try {
			const body: WorkshopAppointment = {
				customerData: {
					name: personalData.fullName ?? '',
					socialName: personalData.socialName,
					documentNumber: onlyNumbers(personalData.cpf ?? ''),
					cellphone: onlyNumbers(personalData.phone ?? ''),
					email: personalData.email ?? '',
				},
				autoRepairShopData: {
					name: workshopSelected.companyName,
					email: workshopSelected.email,
					phone: workshopSelected.phone,
					documentNumber: onlyNumbers(workshopSelected.taxId),
					addressData: {
						city: workshopSelected.city,
						state: workshopSelected.state,
						zipCode: onlyNumbers(workshopSelected.zipCode),
						address: workshopSelected.address,
					},
				},
				scheduleData: {
					date: formatServiceDateTime(appointment.serviceDateTime ?? ''),
					timePeriod: appointment.time ?? '',
				},
				vehicleData: vehicle,
				servicesData: {
					serviceType: product.categories?.subCategory ?? '',
					additionalServices:
						product.selectedItems?.map((item) => item.label) ?? [],
				},
			};

			const success = await WorkshopFinalizeAppointment(body);
			if (success) {
				router.push(url);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoadingButton(false);
		}
	}

	function getProposalProducts(data) {
		if (data.type === 'variant') {
			return [
				{
					id: product.id,
					sku: product.sku,
					subject: product.subject,
					partnerId: 110,
					productQuantity: 1,
				},
			];
		}

		return [
			{
				id: product.id,
				sku: product.sku,
				subject: product.subject,
				partnerId: 110,
				productQuantity: 1,
				items: product.selectedItems?.map((item) => {
					return {
						...item,
						quantity: 1,
					};
				}),
				comboId: product.comboId,
				categories: product.categories,
			},
		];
	}

	function getBodyProposal() {
		return {
			serviceProvision: {
				products: getProposalProducts(product),
				serviceOrder: {
					requester: {
						name: personalData.fullName,
						socialName: personalData.socialName,
						email: personalData.email,
						cellphone: removeNonDigits(String(personalData?.phone)),
						documentNumber: removeSpecialCharacters(String(personalData?.cpf)),
					},
					serviceAddresses: [
						{
							city: address.city,
							state: address.stateCode,
							zipCode: removeSpecialCharacters(String(address.cep)),
							additionalInfo: address.complement,
							neighborhood: address.neighborhood,
							street: address.street,
							latitude: address.latitude,
							streetNumber: address.number,
							longitude: address.longitude,
						},
					],
				},
				coupon: product.coupon,
				partnerProductId: product.partnerProductId,
				schedule: {
					serviceDateTime: appointment.serviceDateTime,
					specialtyCode: product.specialtyCode,
					originCode: product.originCode,
					problem: product.problem,
				},
			},
			marketingOptInFlag: personalData.mktCommunication,
			sessionId: sessionId,
			userAgent: window.navigator.userAgent,
			createProposal: true,
		};
	}

	async function handleSubmitProposal() {
		removeAllCookies();

		try {
			dispatch({ type: 'resetRequestMessageError' });
			dispatch({ type: 'sendingFormInformation', payload: true });

			const body = getBodyProposal();

			const response = await ProposalService(body);

			if (response?.newSchedule?.length > 1) {
				const selectedDate = response.newSchedule[0];
				setAppointmentUser({
					availableDays: response.newSchedule,
					schedules: selectedDate.schedules,
					day: selectedDate.day,
					month: selectedDate.month,
					serviceDateTime: selectedDate.schedules[0].serviceDateTime,
					time: selectedDate.schedules[0].time,
				});
				dispatch({ type: 'showModalRescheduling', payload: true });
				return;
			}

			setCookie('shopping_token', response.cartCommerceId, {
				path: '/',
				domain: cartCookieDomain,
			});
			setCookie('nom_enc_sms', encryptValue(personalData.fullName), {
				path: '/',
				domain: cartCookieDomain,
			});
			setCookie('em_enc_sms', encryptValue(personalData.email), {
				path: '/',
				domain: cartCookieDomain,
			});
			setCookie('mob_enc_sms', encryptValue(personalData.phone), {
				path: '/',
				domain: cartCookieDomain,
			});
			setCookie('sid_enc_sms', encryptValue(sessionId), {
				path: '/',
				domain: cartCookieDomain,
			});
			setCookie(
				'tax_enc_sms',
				encryptValue(removeSpecialCharacters(personalData.cpf)),
				{
					path: '/',
					domain: cartCookieDomain,
				},
			);

			window.sessionStorage.setItem('shopping_token', response.cartCommerceId);

			sendLeadGtmEvent(response.idLead);
			redirectToCart(cartUrl);
		} catch (error) {
			dispatch({ type: 'showModalRescheduling', payload: false });
			dispatch({
				type: 'showRequestMessageError',
				payload: {
					success: false,
					message: 'Não foi possível carregar as informações',
					feedback: 'Tente novamente mais tarde',
				},
			});
			console.error(error);
		} finally {
			dispatch({ type: 'sendingFormInformation', payload: false });
			dispatch({ type: 'setIsOpenModal', payload: false });
		}
	}

	async function handleSubmitRetryProposal() {
		removeAllCookies();
		try {
			dispatch({ type: 'setIsLoadingRetryProposal', payload: true });

			const body = getBodyProposal();
			const response = await ProposalService(body);
			setCookie('shopping_token', response.cartCommerceId, {
				path: '/',
				domain: cartCookieDomain,
			});
			setCookie('nom_enc_sms', encryptValue(personalData.fullName), {
				path: '/',
				domain: cartCookieDomain,
			});
			setCookie('em_enc_sms', encryptValue(personalData.email), {
				path: '/',
				domain: cartCookieDomain,
			});
			setCookie('mob_enc_sms', encryptValue(personalData.phone), {
				path: '/',
				domain: cartCookieDomain,
			});
			setCookie('sid_enc_sms', encryptValue(sessionId), {
				path: '/',
				domain: cartCookieDomain,
			});
			setCookie(
				'tax_enc_sms',
				encryptValue(removeSpecialCharacters(personalData.cpf)),
				{
					path: '/',
					domain: cartCookieDomain,
				},
			);

			window.sessionStorage.setItem('shopping_token', response.cartCommerceId);

			dispatch({
				type: 'showRequestMessageError',
				payload: {
					success: true,
					message: '',
					feedback: '',
				},
			});
			sendLeadGtmEvent(response.idLead);
			redirectToCart(cartUrl);
		} catch (error) {
			dispatch({ type: 'showModalRescheduling', payload: false });
			dispatch({
				type: 'showRequestMessageError',
				payload: {
					success: false,
					message: 'Não foi possível carregar as informações',
					feedback: 'Tente novamente mais tarde',
				},
			});
			console.error(error);
		} finally {
			dispatch({ type: 'setIsLoadingRetryProposal', payload: false });
		}
	}

	useEffect(() => {
		dispatch({ type: 'setAllFieldValue', payload: personalData });
	}, [personalData]);

	useEffect(() => {
		dispatch({ type: 'checkEnableSubmitButton' });
	}, [fields]);

	useEffect(() => {
		dispatch({ type: 'setReminderList', payload: step?.modal?.reminderList });
		if (state.isOpenModal) {
			blockScroll();
			return;
		}
		allowScroll();

		return () => allowScroll();
	}, [state.isOpenModal]);

	return (
		<>
			<DialogError
				isOpen={!!state.requestStatus.message}
				isLoading={state.isLoadingRetryProposal}
				handleClose={() =>
					dispatch({
						type: 'showRequestMessageError',
						payload: {
							success: true,
							message: '',
							feedback: '',
						},
					})
				}
				handleTryAgain={handleSubmitRetryProposal}
			/>
			<SectionCustomData
				pageName="dados-cadastrais"
				product="servico-para-casa-e-auto"
				vertical="servicos"
				subproduct={String(product?.categories?.category).toLowerCase()}
				category="produto"
				funnel="long-form"
			/>
			<div className="acquisition-flow__register-data">
				<div>
					<Typography
						className="acquisition-flow__register-data-title"
						as="h2"
						variant="title5"
					>
						Informe seus dados
					</Typography>
					<FormRegisterData state={state} dispatch={dispatch} />
				</div>
				<CardResume
					isEnableButton={isEnableSubmitButton}
					handleNextStep={handleNextStep}
					variant={variant}
					isLoadingButton={isLoadingButton}
				/>
			</div>

			<DialogSocialName state={state} dispatch={dispatch} />
			{state.isShowModalRescheduling &&
				!!appointment?.availableDays?.length && (
					<ModalRescheduling
						state={state}
						dispatch={dispatch}
						onSubmit={handleSubmitRetryProposal}
					/>
				)}
			{state.isOpenModal && (
				<ModalReminderList
					url={state.url}
					dispatch={dispatch}
					reminderList={reminderList}
					title={String(step?.modal?.title)}
					subtitle={String(step?.modal?.subtitle)}
					isEnableButton={isEnableModalButton}
					refusedOption={refusedOption}
					onNextStep={handleSubmitProposal}
					isLoading={state.isLoading}
				/>
			)}
		</>
	);
}
