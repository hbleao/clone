/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useReducer } from 'react';

import './styles.scss';

import { CardResume, SectionCustomData } from '@/components';
import { Appointment } from './Appointment';
import { ErrorAppointment } from './ErrorAppointment';
import { NoAppointmentAvailable } from './NoAppointmentAvailable';

import { usePageStore, useUserStore } from '@/store';
import { appointmentsReducer } from './reducer';
import { initialState } from './reducer/initialState';

import { PricingService } from '@/services';

import { formatGtm, getStepParam } from '@/utils';

import type { AcquisitionFlowAppointmentsProps } from './types';

export function AcquisitionFlowAppointments({
	getSchedule,
	variant,
}: AcquisitionFlowAppointmentsProps) {
	const router = useRouter();
	const setProductUser = useUserStore((state) => state.setProductUser);
	const setAppointmentUser = useUserStore((state) => state.setAppointmentUser);
	const page = usePageStore((state) => state.page);
	const address = useUserStore((state) => state.user.address);
	const product = useUserStore((state) => state.user.product);
	const workshopSelected = useUserStore((state) => state.user.workshopSelected);
	const [state, dispatch] = useReducer(appointmentsReducer, initialState);
	const step = getStepParam(page.steps);
	const { isEnableButton } = state;

	const {
		mutateAsync: schedulingRequest,
		isPending: isLoadingSchedule,
		isError: isRequestError,
	} = useMutation({
		mutationKey: ['@mutation:schedule'],
		mutationFn: async () => {
			const body = {
				city: address.city,
				stateCode: address.stateCode,
				latitude: address.latitude,
				longitude: address.longitude,
				specialtyCode: product.specialtyCode,
				originCode: product.originCode,
				problemCode: product.problem,
			};
			return await getSchedule({
				body,
				code: workshopSelected.code,
			});
		},
		onSuccess: (data) => {
			const HTTP_NO_CONTENT = 204;
			if (data.status === HTTP_NO_CONTENT) {
				return dispatch({ type: 'setAppointmentUnavailable', payload: true });
			}

			dispatch({ type: 'setAvailableDays', payload: data });
			dispatch({ type: 'setDate', payload: data[0] });
			dispatch({ type: 'setHour', payload: data[0].schedules[0].time });
			dispatch({
				type: 'setDateTime',
				payload: data[0].schedules[0].serviceDateTime,
			});
		},
	});
	const {
		mutateAsync: pricingRequest,
		isError: isErrorPricing,
		isPending: isPendingPricing,
		data: pricingData,
	} = useMutation({
		mutationKey: ['@mutation:pricing'],
		mutationFn: async () => {
			if (!address?.cep || variant !== 'default') return;

			const body = {
				products: [
					{
						id: product.id,
						sku: product.sku,
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
				],
				serviceOrder: {
					serviceAddresses: [
						{
							city: address.city,
							state: address.state,
							zipCode: address.cep.replace('-', ''),
							neighborhood: address.neighborhood,
							street: address.street,
							latitude: address.latitude,
							streetNumber: address.number,
							longitude: address.longitude,
						},
					],
				},
				coupon: '',
				partnerProductId: product.partnerProductId,
			};
			return await PricingService({ body });
		},
		onError: (error) => {
			window.dataLayer.push({
				event: 'alert',
				ev_action: 'agendamento:alert',
				ev_detail: 'nao-foi-possivel-carregar-as-informacoes',
				alert_event: '',
				alert_type: 'erro',
				alert_code: pricingData?.status || 500,
				error_service: 'ServiceFilterByValueService',
				alert_service_message: error.message,
				client_id: '',
				client_bcp: '',
			});
		},
		onSuccess: (data) => {
			const dayStatus = state.appointmentUnavailable
				? 'servico-indisponivel'
				: 'servico-disponivel';
			const formatedValue = new Intl.NumberFormat('pt-BR', {
				style: 'currency',
				currency: 'BRL',
			}).format(data.paymentMethod.otherCardBrands.installment[4]);

			window.dataLayer.push({
				event: 'select_content',
				ev_action: 'verificar-disponibilidade-regiao:sucesso',
				method: 'etapa:agendamento:tipo-consulta:cep',
				status: `disponibilidade:${dayStatus}`,
				ev_label: `localizacao:${formatGtm(address.state)}|${formatGtm(address.city)}|${formatGtm(address.neighborhood)}`,
			});

			setProductUser({
				...product,
				cardPrice: {
					...product.cardPrice,
					price: data?.finalValue,
					oldPrice: data?.initialValue,
					instalmentText: `4x ${formatedValue} sem juros`,
				},
				isLoadingProduct: false,
				isErrorProduct: false,
			});
		},
	});
	const isLoadingAllRequests = isPendingPricing || isLoadingSchedule;
	// TODO: ignorando erro do request Pricing para caps
	const requestsWithError =
		(variant === 'default' && isErrorPricing) || isRequestError;
	const isAppointmentUnavailable = state.appointmentUnavailable;

	function handleEnableButton() {
		if (!state?.selectedDate?.day) return;
		dispatch({ type: 'setEnableButton', payload: !!state.selectedHour });
		setAppointmentUser({
			day: state.selectedDate.day,
			month: state.selectedDate.month,
			time: state.selectedHour,
			serviceDateTime: state.serviceDateTime,
		});
	}

	useEffect(() => {
		pricingRequest();
		schedulingRequest();
	}, []);

	useEffect(() => {
		handleEnableButton();
	}, [state]);

	if (isAppointmentUnavailable) {
		return (
			<div className="acquisition-flow-apointments">
				<NoAppointmentAvailable
					handleRedirect={() => router.push(step?.backLink)}
					title="Agenda indisponível"
					message={
						'Neste momento não temos datas disponíveis para este serviço na sua região nos próximos 15 dias'
					}
					buttonLabel="Ver outros serviços"
				/>
			</div>
		);
	}

	if (requestsWithError) {
		return (
			<div className="acquisition-flow-appointments">
				<ErrorAppointment
					title="Não foi possível carregar as informações"
					message="Por favor, tente novamente."
					buttonLabel="Tentar novamente"
					icon="icon-porto-ic-exit"
					handleTryAgain={schedulingRequest}
				/>
			</div>
		);
	}

	return (
		<div className="acquisition-flow-appointments">
			<SectionCustomData
				pageName="agendamento"
				product="servico-para-casa-e-auto"
				vertical="servicos"
				subproduct={String(product?.categories?.category).toLowerCase()}
				category="produto"
				funnel="short-form"
			/>
			<Appointment
				title="Selecione o dia e o horário"
				subtitle="Confira a disponibilidade para os próximos dias."
				state={state}
				dispatch={dispatch}
				isLoading={isLoadingAllRequests}
				variant={variant}
			/>
			<CardResume
				scheduleState={state}
				isEnableButton={isEnableButton}
				handleNextStep={(url) => router.push(url)}
				isLoading={isLoadingAllRequests}
				variant={variant}
			/>
		</div>
	);
}
