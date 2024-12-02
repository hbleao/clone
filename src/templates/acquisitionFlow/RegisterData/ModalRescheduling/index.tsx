'use client';
import { Button } from '@porto-ocean/button';
import { Icon } from '@porto-ocean/icon';
import * as Modal from '@porto-ocean/modal';

import './styles.scss';

import { Rescheduling } from './Rescheduling';

import { useUserStore } from '@/store';

import type { ModalReschedulingProps } from './types';

export const ModalRescheduling = ({
	dispatch,
	state,
	onSubmit,
}: ModalReschedulingProps) => {
	const appointment = useUserStore((state) => state.user.appointment);
	const isEnableSchedulingButton = appointment?.day && appointment?.time;

	return (
		<>
			<Modal.Overlay />
			<Modal.Root className="acquisition-flow-rescheduling">
				<Modal.Content>
					<Modal.Header>
						<Modal.ContentIconClose
							onClick={() =>
								dispatch({ type: 'showModalRescheduling', payload: false })
							}
						>
							<Icon size="text-md" iconName="icon-porto-ic-close" />
						</Modal.ContentIconClose>
					</Modal.Header>
					<Modal.Body>
						<Rescheduling
							title="Poxa, será preciso agendar novamente"
							subtitle="Não é possível continuar com o dia e o horário que você
								escolheu, pois o tempo expirou."
							state={state}
							dispatch={dispatch}
							isLoading={false}
						/>
						<Button
							width="fluid"
							variant={isEnableSchedulingButton ? 'insurance' : 'disabled'}
							styles="primary"
							isLoading={state.isLoadingRetryProposal}
							onClick={onSubmit}
							disabled={!isEnableSchedulingButton}
						>
							Continuar
						</Button>
					</Modal.Body>
				</Modal.Content>
			</Modal.Root>
		</>
	);
};
