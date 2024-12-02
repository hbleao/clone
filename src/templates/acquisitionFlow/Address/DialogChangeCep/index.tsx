import { useUserStore } from '@/store';

import { Link } from '@/components';
import * as Dialog from '@/components/Dialog';

export type DialogChangeCepProps = {
	state: any;
	dispatch: any;
};

export const DialogChangeCep = ({ state, dispatch }: DialogChangeCepProps) => {
	const product = useUserStore((state) => state.user.product);

	return (
		<Dialog.Root isOpen={state.isOpenDialog} variant="small">
			<Dialog.Typography as="h3" className="dialog__title" color="black85">
				Você deseja mudar o local do serviço?
			</Dialog.Typography>
			<Dialog.Body>
				<Dialog.Typography
					variant="body1"
					weight="regular"
					as="p"
					color="black85"
					className="dialog__subtitle"
				>
					Alterar o endereço pode fazer com que o serviço não esteja disponível
					na nova região.
				</Dialog.Typography>
				<Dialog.Typography
					variant="body1"
					weight="regular"
					as="p"
					className="dialog__description"
					color="black75"
				>
					<strong>Importante:</strong> Você será direcionado para a página do
					serviço.
				</Dialog.Typography>
			</Dialog.Body>
			<Dialog.Footer variant="column">
				<Link
					href={`/servicos/${product.alias}`}
					data-gtm-type="click"
					data-gtm-clicktype="button"
					data-gtm-name="porto-servico:local-do-servico"
					data-gtm-subname="voce-deseja-mudar-o-local-do-servico:sim-quero-alterar"
					onClick={() => {
						window.dataLayer.push({
							event: 'dialog',
							action: 'open',
							name: 'voce-deseja-mudar-o-local-do-servico',
						});
					}}
					width="fluid"
				>
					Sim, quero alterar
				</Link>
				<Dialog.Button
					className="--fluid --insurance-secondary"
					data-gtm-type="click"
					data-gtm-clicktype="button"
					data-gtm-name="porto-servico:local-do-servico"
					data-gtm-subname="voce-deseja-mudar-o-local-do-servico:nao"
					onClick={() => {
						dispatch({ type: 'toggleDialog' });
						window.dataLayer.push({
							event: 'dialog',
							action: 'close',
							name: 'voce-deseja-mudar-o-local-do-servico',
						});
					}}
				>
					Não
				</Dialog.Button>
			</Dialog.Footer>
		</Dialog.Root>
	);
};
