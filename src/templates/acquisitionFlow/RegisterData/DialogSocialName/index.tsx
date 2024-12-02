import * as Dialog from '@/components/Dialog';

import type { DialogSocialNameProps } from './types';

export const DialogSocialName = ({
	state,
	dispatch,
}: DialogSocialNameProps) => {
	return (
		<Dialog.Root isOpen={state.isOpenDialog} variant="small">
			<Dialog.Typography as="h3" className="dialog__title" color="black85">
				Você é uma pessoa travesti ou transexual?
			</Dialog.Typography>
			<Dialog.Body>
				<Dialog.Typography
					variant="body1"
					weight="regular"
					as="p"
					color="black85"
					className="dialog__subtitle"
				>
					Caso seja, pode usar seu nome social na Porto.
				</Dialog.Typography>
				<Dialog.Typography
					variant="body1"
					weight="regular"
					as="p"
					className="dialog__description"
					color="black75"
				>
					<strong>Atenção! Não informe:</strong> apelido; nome fantasia,
					comercial ou religioso; titulação profissional, acadêmica; pronome de
					tratamento.
				</Dialog.Typography>
			</Dialog.Body>
			<Dialog.Footer variant="column">
				<Dialog.Button
					data-gtm-type="click"
					data-gtm-clicktype="button"
					data-gtm-name="porto-servico:dados-cadastrais"
					data-gtm-subname="voce-e-uma-pessoa-travesti-ou-transexual:sim-eu-sou"
					className="--fluid --insurance-primary"
					onClick={() => {
						window.dataLayer.push({
							event: 'dialog',
							action: 'close',
							name: 'voce-e-uma-pessoa-travesti-ou-transexual',
						});
						dispatch({
							type: 'setFieldValue',
							fieldName: 'hasSocialName',
							payload: true,
						});
						dispatch({ type: 'setIsOpenDialog', payload: false });
					}}
				>
					Sim, eu sou
				</Dialog.Button>
				<Dialog.Button
					className="--fluid --insurance-secondary"
					data-gtm-type="click"
					data-gtm-clicktype="button"
					data-gtm-name="porto-servico:dados-cadastrais"
					data-gtm-subname="voce-e-uma-pessoa-travesti-ou-transexual:nao-sou"
					onClick={() => {
						window.dataLayer.push({
							event: 'dialog',
							action: 'close',
							name: 'voce-e-uma-pessoa-travesti-ou-transexual',
						});
						dispatch({
							type: 'setFieldValue',
							fieldName: 'hasSocialName',
							payload: false,
						});
						dispatch({ type: 'setIsOpenDialog', payload: false });
					}}
				>
					Não sou
				</Dialog.Button>
			</Dialog.Footer>
		</Dialog.Root>
	);
};
