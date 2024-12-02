'use client';

import './styles.scss';

import * as Dialog from '@/components/Dialog';

export type DialogErrorProps = {
	isOpen: boolean;
	isLoading: boolean;
	handleClose: () => void;
	handleTryAgain: () => void;
};

export const DialogError = ({
	isOpen,
	isLoading,
	handleClose,
	handleTryAgain,
}: DialogErrorProps) => {
	return (
		<Dialog.Root isOpen={isOpen} id="dialog-error-proposal">
			<Dialog.Header>
				<div className="dialog-error-proposal__header">
					<Dialog.Icon size="text-3xl" iconName="icon-porto-ic-fan" />
					<Dialog.Icon
						size="text-md"
						iconName="icon-porto-ic-close"
						onClick={handleClose}
					/>
				</div>
			</Dialog.Header>
			<Dialog.Typography as="h3" className="dialog__title" color="black85">
				Poxa, nosso sistema está indisponível no momento
			</Dialog.Typography>
			<Dialog.Body>
				<Dialog.Typography
					variant="body1"
					weight="bold"
					as="p"
					color="black85"
					className="dialog__subtitle"
				>
					Estamos trabalhando para que volte a funcionar o quanto antes.
				</Dialog.Typography>
				<Dialog.Typography
					variant="body1"
					weight="regular"
					as="p"
					className="dialog__description"
					color="black75"
				>
					Por favor, tente novamente.
				</Dialog.Typography>
			</Dialog.Body>
			<Dialog.Footer variant="row">
				<Dialog.Button
					width="fluid"
					onClick={handleTryAgain}
					isLoading={isLoading}
				>
					Tentar novamente
				</Dialog.Button>
			</Dialog.Footer>
		</Dialog.Root>
	);
};
