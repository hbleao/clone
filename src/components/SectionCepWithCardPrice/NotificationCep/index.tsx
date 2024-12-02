import * as Notification from '@porto-ocean/notification';

import type { NotificationCepProps } from './types';

export const NotificationCep = ({
	address,
	cep,
	error,
	coverage,
}: NotificationCepProps) => {
	let notificationType = '';
	const notification = {
		eligible: {
			variant: 'outlined',
			iconName: 'icon-porto-ic-residence',
			message: {
				title: `${address?.street}`,
				description: `${cep} - ${address?.city}/${address?.state}`,
			},
		},
		notEligible: {
			variant: 'attention',
			iconName: 'icon-porto-ic-bad',
			message: {
				title: 'Serviço indisponível',
				description:
					'Neste momento, este serviço não está disponível para a região informada.',
			},
		},
		outService: {
			variant: 'error',
			iconName: 'icon-porto-ic-bad',
			message: {
				title: 'Serviço indisponível',
				description:
					'No momento nosso serviço está indíponivel, tente novamente mais tarde.',
			},
		},
	};

	if (error) {
		notificationType = 'outService';
	} else if (!error && coverage) {
		notificationType = 'eligible';
	} else if (!error && !coverage) {
		notificationType = 'notEligible';
	} else if (!error && !cep) {
		notificationType = 'notEligible';
	}

	return (
		<Notification.Root
			variant={notification[notificationType].variant}
			className="section-cep-with-card-price__notification"
		>
			<Notification.Icon
				iconName={notification[notificationType].iconName}
				data-testid="icon"
			/>
			<Notification.Content>
				<Notification.Title data-testid="title">
					{notification[notificationType].message.title}
				</Notification.Title>
				<Notification.Description data-testid="description">
					{notification[notificationType].message.description}
				</Notification.Description>
			</Notification.Content>
		</Notification.Root>
	);
};
