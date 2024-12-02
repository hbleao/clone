'use client';
import { Button } from '@porto-ocean/button';
import { Icon } from '@porto-ocean/icon';
import * as Modal from '@porto-ocean/modal';
import { Typography } from '@porto-ocean/typography';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import './styles.scss';

import { ProductOptions } from './ProductOptions';

import { useUserStore } from '@/store';

export const ModalAcquisitionFirstStep = ({
	handleCloseModal,
	allowScroll,
}: any) => {
	const product = useUserStore((state) => state.user.product);
	const limit = product.maxServices;
	const type = product.type;
	const [buttonVariant, setButtonVariant] = useState<any>('disabled');
	const router = useRouter();
	const buttonStyle = product.selectedItems?.length ? 'insurance' : 'disabled';

	function handleNextStep() {
		if (!product?.items?.length) return;
		allowScroll();
		handleCloseModal();
		router.push('/loja/servicos/agendamento');
	}

	useEffect(() => {
		setButtonVariant(buttonStyle);
	}, [product]);

	return (
		<>
			<Modal.Overlay />
			<Modal.Root className="modal-first-acquisition">
				<Modal.Content>
					<>
						<Modal.Header>
							<Modal.ContentIconClose
								onClick={handleCloseModal}
								data-gtm-type="click"
								data-gtm-clicktype="button"
								data-gtm-name="selecione-opcao"
								data-gtm-subname="fechar"
							>
								<Icon size="text-md" iconName="icon-porto-ic-close" />
							</Modal.ContentIconClose>
							<div className="modal-first-acquisition__header">
								<Modal.ContentTitle>
									{Number(limit) > 1
										? `Selecione até ${limit || 0} serviços pelo mesmo valor`
										: 'Selecione a opção'}
								</Modal.ContentTitle>

								<Typography as="h5" variant="body2" color="black70">
									Serviços escolhidos:
									<span className="modal-first-acquisition__service-quantity">
										{product.selectedItems?.length || 0} / {limit || 0}
									</span>
								</Typography>
							</div>
						</Modal.Header>
						<Modal.Body>
							<ProductOptions productType={String(type)} />
							<Button
								width="fluid"
								variant={buttonVariant}
								styles="primary"
								key="continuar"
								data-gtm-type="click"
								data-gtm-clicktype="button"
								data-gtm-name="selecione-opcao"
								data-gtm-subname="agendar-agora"
								onClick={() =>
									buttonVariant === 'insurance' ? handleNextStep() : null
								}
							>
								Agendar agora
							</Button>
						</Modal.Body>
					</>
				</Modal.Content>
			</Modal.Root>
		</>
	);
};
