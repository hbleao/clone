/* eslint-disable import-helpers/order-imports */
'use client';
import { Icon } from '@porto-ocean/icon';
import * as Input from '@porto-ocean/input';
import * as Modal from '@porto-ocean/modal';
import { Typography } from '@porto-ocean/typography';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import './styles.scss';

import { ServiceFilterByValueService } from '@/services';

import { CustomIcons } from '@/constants';
import { useDebounce } from '@/hooks';
import { formatGtm, sanitize, setupDataLayer } from '@/utils';

export const ModalProductFilter = ({ handleCloseModal, sectionTitle }: any) => {
	const [searchProduct, setSearchProduct] = useState('');
	const inputDebounceValue = useDebounce(searchProduct, 700);
	const [errorProduct, setErrorProduct] = useState(false);

	const {
		data: filteredProducts,
		mutateAsync,
		isPending: isLoading,
		error,
	} = useMutation({
		mutationKey: ['@mutation:filterService'],
		mutationFn: async () => {
			return await ServiceFilterByValueService({
				value: inputDebounceValue,
			});
		},
		onError: (error) => {
			window.dataLayer.push({
				event: 'alert',
				ev_action: 'consultou:loja:pesquisa-de-produto:alert',
				ev_detail: error.message,
				alert_event: 'erro',
				alert_code: error.name,
				error_service: 'ServiceFilterByValueService',
				alert_service_message: error.message,
				client_id: '',
				client_bcp: '',
			});
		},
	});

	const handleInputChange = (value: string) => {
		setSearchProduct(value);
	};

	function handleSearchProducts() {
		mutateAsync();
	}

	useEffect(() => {
		if (filteredProducts?.length === 0 && !isLoading) {
			setErrorProduct(true);
			return;
		}
		setErrorProduct(false);
	}, [filteredProducts]);

	useEffect(() => {
		setupDataLayer();
		handleSearchProducts();
	}, [inputDebounceValue]);

	return (
		<>
			<Modal.Overlay />
			<Modal.Root className="section-modal-product-filter">
				<Modal.Content>
					<Modal.Header>
						<Modal.ContentIconClose
							onClick={() => {
								handleCloseModal();
								window.dataLayer.push({
									event: 'modal',
									action: 'close',
									name: 'todos-os-servicos',
								});
							}}
							data-gtm-type="click"
							data-gtm-clicktype="button"
							data-gtm-name="primeira-etapa"
							data-gtm-subname="fechar"
						>
							<Icon size="text-md" iconName="icon-porto-ic-close" />
						</Modal.ContentIconClose>
						<div className="section-modal-product-filter__header">
							<Modal.ContentTitle>Todos os serviços</Modal.ContentTitle>
						</div>
					</Modal.Header>
					<Modal.Body>
						<Input.Root
							width="fluid"
							filled={!!searchProduct}
							variant="default"
							className="section-cep-with-card-price__input"
							error={!!error || errorProduct}
							data-gtm-type="form"
							data-gtm-clicktype="input"
							data-gtm-name={formatGtm(sectionTitle)}
							data-gtm-subname="todos-os-servicos:informe-o-que-precisa"
						>
							<Input.Box>
								<Input.Label>Informe o que precisa</Input.Label>
								<Input.Field
									value={searchProduct}
									onChange={(e) => handleInputChange(sanitize(e.target.value))}
								/>
								{isLoading && <span className="btn-loader" />}
								{!isLoading && (
									<Icon
										className="search-icon"
										iconName="icon-porto-ic-magnifier-glass"
										size="text-md"
									/>
								)}
							</Input.Box>
							{!!error && (
								<Input.ErrorMessage>
									Serviço Indisponivel no momento
								</Input.ErrorMessage>
							)}
							{errorProduct && (
								<Input.ErrorMessage>
									Não encontramos serviços para o tema digitado
								</Input.ErrorMessage>
							)}
						</Input.Root>
						<div className="section-modal-product-filter__container">
							{filteredProducts?.map((product) => (
								<div key={product.category}>
									<div className="section-modal-product-filter__title">
										<CustomIcons iconName={product.icon} />
										<Typography
											as="h5"
											variant="body2"
											color="black70"
											weight="semibold"
										>
											{product.category}
										</Typography>
									</div>
									<div className="section-modal-product-filter__subproduct">
										{product?.products.map((subProduct) => (
											<a
												href={subProduct.link.href}
												target="_blank"
												className="section-modal-product-filter__link"
												key={subProduct.description}
												rel="noreferrer"
												data-gtm-type="click"
												data-gtm-clicktype="button"
												data-gtm-name={formatGtm(sectionTitle)}
												data-gtm-subname={`${formatGtm(product.category)}:${formatGtm(subProduct.description)}`}
											>
												<Typography
													as="p"
													variant="body2"
													color="portoSeguros100"
												>
													{subProduct.description}
												</Typography>
												<div className="section-modal-product-filter__icon__box">
													{subProduct.isNew && (
														<div className="section-modal-product-filter__new">
															<Typography
																as="p"
																variant="label"
																weight="bold"
																color="white"
															>
																Novo
															</Typography>
														</div>
													)}
													<Icon
														iconName="icon-porto-ic-short-arrow-right"
														size="text-md"
														className="section-modal-product-filter__icon__color"
													/>
												</div>
											</a>
										))}
									</div>
								</div>
							))}
						</div>
					</Modal.Body>
				</Modal.Content>
			</Modal.Root>
		</>
	);
};
