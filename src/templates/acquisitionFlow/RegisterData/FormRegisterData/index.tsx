'use client';
import { Button } from '@porto-ocean/button';
import { Icon } from '@porto-ocean/icon';
import * as Input from '@porto-ocean/input';
import * as Notification from '@porto-ocean/notification';
import { Typography } from '@porto-ocean/typography';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

import './styles.scss';

import { DataQualityService, PricingService } from '@/services';
import { useUserStore } from '@/store';

import * as Checkbox from '@/components/Checkbox';
import * as Tooltip from '@/components/Tooltip';

import { cpfMask, formatGtm, onlyNumbers, phoneMask, sanitize } from '@/utils';

import {
	ValidationBuilder,
	ValidationComposite,
} from '@/validation/validators';

import { CustomIcons } from '@/constants';
import { getInstallmentText } from './getInstallmentText';
import type { FormRegisterDataProps } from './types';

export const FormRegisterData = ({
	state,
	dispatch,
}: FormRegisterDataProps) => {
	const setPersonalDataUser = useUserStore(
		(state) => state.setPersonalDataUser,
	);
	const address = useUserStore((state) => state.user.address);
	const setProductUser = useUserStore((state) => state.setProductUser);
	const product = useUserStore((state) => state.user.product);
	const { fields, errors } = state;
	const {
		data: pricing,
		isPending: isLoadingRequestPricing,
		mutateAsync: pricingRequest,
	} = useMutation({
		mutationKey: ['@mutation:pricing'],
		mutationFn: async () => {
			if (!address?.cep) return;
			dispatch({ type: 'setIsLoadingPricing', payload: true });
			dispatch({
				type: 'setErrors',
				fieldName: 'coupon',
				payload: '',
			});

			setProductUser({
				...product,
				coupon: '',
			});
			dispatch({
				type: 'setErrors',
				fieldName: 'coupon',
				payload: '',
			});

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
				coupon: state.fields.coupon,
				partnerProductId: product.partnerProductId,
			};
			return await PricingService({ body });
		},
		onSuccess: (data) => {
			dispatch({
				type: 'setIsLoadingPricing',
				payload: false,
			});
			setProductUser({
				...product,
				cardPrice: {
					...product.cardPrice,
					price: data?.finalValue,
					oldPrice: data?.initialValue,
					discount: data.discountValue,
					instalmentText: getInstallmentText(
						data?.paymentMethod?.otherCardBrands,
					),
				},
				coupon: data.couponStatus === 'valid' ? state.fields.coupon : '',
				isValidCoupon: data.couponStatus === 'valid',
			});

			dispatch({ type: 'setIsValidCoupon', payload: true });
			state.fields.coupon &&
				window.dataLayer.push({
					event: 'select_content',
					ev_action: 'aplicou:porto-servico:dados-cadastrais:sucesso',
					ev_label: 'cupom-promocional',
					ev_detail: state.fields.coupon,
					status: data.products[0].couponStatus,
				});
		},
		onError: (error) => {
			dispatch({ type: 'setIsLoadingPricing', payload: false });
			dispatch({ type: 'setIsValidCoupon', payload: false });
			window.dataLayer.push({
				event: 'alert',
				ev_action: `aplicou:porto-servico:${formatGtm(product?.categories?.category)}:dados-cadastrais:alert`,
				ev_label: formatGtm(errors.coupon),
				alert_event: 'select_content',
				alert_type: 'erro',
				alert_code: 400,
				error_service: 'PricingService',
				alert_service_message: error.message,
				client_id: '',
				client_bcp: '',
			});
		},
	});
	const termsText =
		"Ao continuar, você está ciente de que a Porto irá coletar e tratar seus dados pessoais de acordo com a nossa  <a href='https://www.portoseguro.com.br/privacidade' target='blank'>Política de Privacidade</a> e <a href='https://www.portoseguro.com.br/termos-de-uso' target='blank'>Termos de Uso</a>.";
	const hasValueInCouponField = fields?.coupon?.length > 5;
	async function handleInputValue(fieldName?: string, fieldValue?: string) {
		dispatch({
			type: 'setFieldValue',
			fieldName: fieldName,
			payload: fieldValue,
		});
		setPersonalDataUser({
			...fields,
			[fieldName as string]: fieldValue,
		});
	}

	function handleFieldsValidation() {
		const validation = ValidationComposite.build([
			...ValidationBuilder.field('cpf')
				.required()
				.cpf('Infome um cpf.')
				.build(),
			...ValidationBuilder.field('fullName')
				.required()
				.min(8, 'Informe o nome completo.')
				.build(),
			...ValidationBuilder.field('phone')
				.required()
				.min(10, 'Número de telefone inválido')
				.build(),
			...ValidationBuilder.field('email').required().email().build(),
		]);

		const fieldsValidation = [
			{ field: 'cpf', value: fields.cpf },
			{ field: 'fullName', value: fields.fullName },
			{ field: 'phone', value: fields.phone },
			{ field: 'email', value: fields.email },
		];

		for (let i = 0; i < fieldsValidation.length; i++) {
			if (fieldsValidation[i].value) {
				!!validation.validate(
					fieldsValidation[i].field,
					fieldsValidation[i].value,
				) &&
					window.dataLayer?.push({
						event: 'alert',
						ev_action: 'preencheu:dados-cadastrais:alert',
						ev_label: formatGtm(
							validation.validate(
								fieldsValidation[i].field,
								fieldsValidation[i].value,
							),
						),
						alert_event: 'select_content',
						alert_type: 'usuario',
						alert_code: '',
						error_service: '',
						alert_service_message: formatGtm(
							validation.validate(
								fieldsValidation[i].field,
								fieldsValidation[i].value,
							),
						),
						client_id: '',
						client_bcp: '',
					});
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

	function handleCheckboxSocialName() {
		window.dataLayer.push({
			event: 'dialog',
			action: 'open',
			name: 'voce-e-uma-pessoa-travesti-ou-transexual',
		});

		if (fields.hasSocialName) {
			dispatch({
				type: 'setFieldValue',
				fieldName: 'socialName',
				payload: '',
			});
			dispatch({
				type: 'setFieldValue',
				fieldName: 'hasSocialName',
				payload: false,
			});
			setPersonalDataUser({
				socialName: '',
				hasSocialName: false,
			});
			return;
		}

		dispatch({ type: 'setIsOpenDialog', payload: true });
	}

	async function handleDataQualityEmail() {
		try {
			if (!fields.email) return;
			dispatch({ type: 'setDataQualityLoadingEmail', payload: true });

			const data = await DataQualityService({
				type: 'email',
				param: state.fields.email,
			});

			dispatch({
				type: 'setErrors',
				fieldName: 'email',
				payload: data.message,
			});
		} catch (error) {
			dispatch({
				type: 'setErrors',
				fieldName: 'email',
				payload: 'Serviço indisponível',
			});
			console.error('handleDataQualityEmail:', error);
		} finally {
			dispatch({ type: 'setDataQualityLoadingEmail', payload: false });
		}
	}

	async function handleDataQualityPhone() {
		try {
			if (!fields.phone) return;
			dispatch({ type: 'setDataQualityLoadingPhone', payload: true });

			const data = await DataQualityService({
				type: 'telefone',
				param: onlyNumbers(state.fields.phone),
			});

			dispatch({
				type: 'setErrors',
				fieldName: 'phone',
				payload: data.message,
			});
		} catch (error) {
			dispatch({
				type: 'setErrors',
				fieldName: 'phone',
				payload: 'Serviço indisponível',
			});
			console.error('handleDataQualityPhone:', error);
		} finally {
			dispatch({ type: 'setDataQualityLoadingPhone', payload: false });
		}
	}

	async function handleDataQualitySocialName() {
		try {
			if (!fields.socialName) return;

			dispatch({ type: 'setDataQualityLoadingSocialName', payload: true });

			const data = await DataQualityService({
				type: 'nome-social',
				param: fields.socialName,
			});

			dispatch({
				type: 'setErrors',
				fieldName: 'socialName',
				payload: data.message,
			});
		} catch (error) {
			console.error('handleDataQualitySocialName:', error);
		} finally {
			dispatch({ type: 'setDataQualityLoadingSocialName', payload: false });
		}
	}

	async function handlePricingWithCoupon() {
		if (!hasValueInCouponField) return;
		pricingRequest();
	}

	function handleResetCouponErrorAndCleanField() {
		dispatch({ type: 'cleanCoupon' });
		setProductUser({
			...product,
			coupon: '',
		});
		dispatch({
			type: 'setErrors',
			fieldName: 'coupon',
			payload: '',
		});
		pricingRequest();
	}

	useEffect(() => {
		handleFieldsValidation();
		dispatch({ type: 'checkEnableSubmitButton' });
	}, [state]);

	useEffect(() => {
		if (pricing?.couponStatus === 'invalid') {
			dispatch({
				type: 'setErrors',
				fieldName: 'coupon',
				payload: 'Cupom inválido ou expirado',
			});
		}

		dispatch({ type: 'checkEnableSubmitButton' });
	}, [pricing]);

	return (
		<form className="acquisition-flow-form-register">
			<Input.Root width="fluid" filled={!!fields.cpf} error={!!errors.cpf}>
				<Input.Box>
					<Input.Label>CPF</Input.Label>
					<Input.Field
						data-gtm-type="form"
						data-gtm-clicktype="input"
						data-gtm-name="porto-servico:dados-cadastrais"
						data-gtm-subname="informe-seus-dados:cpf"
						value={fields.cpf}
						onChange={(e) =>
							handleInputValue('cpf', cpfMask(sanitize(e.target.value)))
						}
					/>
				</Input.Box>
				{!!errors.cpf && <Input.ErrorMessage>{errors.cpf}</Input.ErrorMessage>}
			</Input.Root>

			<Input.Root
				width="fluid"
				filled={!!fields.fullName}
				error={!!errors.fullName}
			>
				<Input.Box>
					<Input.Label>Nome completo</Input.Label>
					<Input.Field
						data-gtm-type="form"
						data-gtm-clicktype="input"
						data-gtm-name="porto-servico:dados-cadastrais"
						data-gtm-subname="informe-seus-dados:nome-completo"
						value={fields.fullName}
						onChange={(e) =>
							handleInputValue('fullName', sanitize(e.target.value))
						}
					/>
				</Input.Box>
				{!!errors.fullName && (
					<Input.ErrorMessage>{errors.fullName}</Input.ErrorMessage>
				)}
			</Input.Root>

			<div className="acquisition-flow-form-register__social-name">
				<Checkbox.Root
					variant={fields.hasSocialName ? 'checked' : 'default'}
					onClick={handleCheckboxSocialName}
					data-gtm-type="form"
					data-gtm-clicktype="input"
					data-gtm-name="porto-servico:dados-cadastrais"
					data-gtm-subname="informe-seus-dados:tenho-nome-social"
				>
					<Checkbox.Input />
					<Checkbox.Label>Tenho nome social</Checkbox.Label>
				</Checkbox.Root>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Icon iconName="icon-porto-ic-circle-question" size="text-md" />
					</Tooltip.Trigger>
					<Tooltip.Content variant="top">
						<Typography variant="label" as="p">
							Nome social é o nome pelo qual a pessoa travesti, transgênero ou
							transexual se identifica e é socialmente reconhecida.
						</Typography>
					</Tooltip.Content>
				</Tooltip.Root>
			</div>

			{fields.hasSocialName && (
				<div className="social-name">
					<Input.Root
						width="fluid"
						filled={!!fields.socialName}
						error={!!errors.socialName}
					>
						<Input.Box>
							<Input.Label>Nome social</Input.Label>
							<Input.Field
								value={fields.socialName}
								onChange={(e) =>
									handleInputValue('socialName', sanitize(e.target.value))
								}
								onBlur={handleDataQualitySocialName}
							/>
							{state.isLoadingSocialName && <span className="btn-loader" />}
						</Input.Box>
						{!!errors.socialName && (
							<Input.ErrorMessage>{errors.socialName}</Input.ErrorMessage>
						)}
					</Input.Root>
					<Notification.Root variant="outlined">
						<Notification.Icon iconName="icon-porto-ic-circle-question" />
						<Notification.Content>
							<Notification.Description>
								Seu nome social será utilizado para sua identificação na Porto.
								Em caso de ajustes em apólices e contratos vigentes, entre em
								contato com o(a) Corretor(a) responsável ou com nosso canal de
								atendimento.
							</Notification.Description>
						</Notification.Content>
					</Notification.Root>
				</div>
			)}

			<Input.Root width="fluid" filled={!!fields.phone} error={!!errors.phone}>
				<Input.Box>
					<Input.Label>Celular (com DDD)</Input.Label>
					<Input.Field
						data-gtm-type="form"
						data-gtm-clicktype="input"
						data-gtm-name="porto-servico:dados-cadastrais"
						data-gtm-subname="informe-seus-dados:celular-com-ddd"
						type="tel"
						value={fields.phone}
						onChange={(e) =>
							handleInputValue('phone', phoneMask(sanitize(e.target.value)))
						}
						onBlur={handleDataQualityPhone}
					/>
					{state.isLoadingPhone && <span className="btn-loader" />}
				</Input.Box>
				{!!errors.phone && (
					<Input.ErrorMessage>
						Informe um número de celular válido.
					</Input.ErrorMessage>
				)}
			</Input.Root>

			<Input.Root width="fluid" filled={!!fields.email} error={!!errors.email}>
				<Input.Box>
					<Input.Label>E-mail</Input.Label>
					<Input.Field
						data-gtm-type="form"
						data-gtm-clicktype="input"
						data-gtm-name="porto-servico:dados-cadastrais"
						data-gtm-subname="informe-seus-dados:email"
						value={fields.email}
						onChange={(e) =>
							handleInputValue('email', sanitize(e.target.value))
						}
						onBlur={handleDataQualityEmail}
					/>
					{state.isLoadingEmail && <span className="btn-loader" />}
				</Input.Box>
				{!!errors.email && (
					<Input.ErrorMessage>Informe um e-mail válido</Input.ErrorMessage>
				)}
			</Input.Root>

			<div className="acquisition-flow-form-register__coupon">
				<Input.Root
					width="fluid"
					filled={!!fields.coupon}
					error={!!errors.coupon}
				>
					<Input.Box>
						<Input.Label>Digite o cupom aqui</Input.Label>
						<Input.Field
							data-gtm-type="form"
							data-gtm-clicktype="input"
							data-gtm-name="porto-servico:dados-cadastrais"
							data-gtm-subname="informe-seus-dados:cupom-de-desconto"
							value={state.fields.coupon}
							onChange={(e) => {
								dispatch({
									type: 'setFieldValue',
									fieldName: 'coupon',
									payload: sanitize(e.target.value),
								});

								if (e.target.value === '')
									handleResetCouponErrorAndCleanField();
							}}
						/>
						{hasValueInCouponField && (
							<div
								className="acquisition-flow-form-register__coupon-close"
								onClick={handleResetCouponErrorAndCleanField}
								onKeyDown={handleResetCouponErrorAndCleanField}
							>
								<CustomIcons iconName="icon-porto-ic-circle-close" />
							</div>
						)}
					</Input.Box>

					{!!errors.coupon && (
						<Input.ErrorMessage>{errors.coupon}</Input.ErrorMessage>
					)}
				</Input.Root>

				<Button
					variant={hasValueInCouponField ? 'insurance' : 'disabled'}
					styles="secondary"
					width="fluid"
					type="button"
					disable={hasValueInCouponField}
					onClick={handlePricingWithCoupon}
					data-gtm-type="click"
					data-gtm-clicktype="button"
					data-gtm-name="porto-servico:dados-cadastrais"
					data-gtm-subname="informe-seus-dados:cupom-de-desconto:aplicar"
				>
					{isLoadingRequestPricing ? (
						<span className="btn-loader" />
					) : (
						'Aplicar'
					)}
				</Button>
			</div>

			<Checkbox.Root
				variant={fields.mktCommunication ? 'checked' : 'default'}
				data-gtm-type="form"
				data-gtm-clicktype="input"
				data-gtm-name="porto-servico:dados-cadastrais"
				data-gtm-subname="informe-seus-dados:nao-tenho-interesse-em-receber-comunicacao-com-condicoes-especiais-e-ofertas-de-produtos-e-servicos-porto"
				onClick={() => {
					dispatch({
						type: 'setFieldValue',
						fieldName: 'mktCommunication',
						payload: !fields.mktCommunication,
					});
					setPersonalDataUser({
						...state.fields,
						mktCommunication: !fields.mktCommunication,
					});
				}}
			>
				<Checkbox.Input />
				<Checkbox.Label>
					Não tenho interesse em receber comunicação com condições especiais e
					ofertas de produtos e serviços Porto.
				</Checkbox.Label>
			</Checkbox.Root>

			<Checkbox.Root variant={fields.acceptTerms ? 'checked' : 'default'}>
				<Checkbox.Input
					data-gtm-type="form"
					data-gtm-clicktype="input"
					data-gtm-name="porto-servico:dados-cadastrais"
					data-gtm-subname="informe-seus-dados:ao-continuar-voce-esta-ciente-de-que-a-porto-ira-coletar-e-tratar-seus-dados-pessoais-de-acordo-com-a-nossa-politica-de-privacidade-e-termos-de-uso"
					onClick={() => {
						setPersonalDataUser({
							...state.fields,
							acceptTerms: !fields.acceptTerms,
						});
						dispatch({
							type: 'setFieldValue',
							fieldName: 'acceptTerms',
							payload: !fields.acceptTerms,
						});
					}}
				/>
				<Checkbox.Label
					dangerouslySetInnerHTML={{
						__html: termsText,
					}}
				/>
			</Checkbox.Root>
		</form>
	);
};
