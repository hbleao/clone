import { Typography } from '@porto-ocean/typography';

import './styles.scss';

import { ShimmerHours } from './ShimmerHours';

import * as Radio from '@/components/Radio';

import { useUserStore } from '@/store';

import { formatGtm } from '@/utils';

import type { HoursProps } from './types';

export const Hours = ({ isLoading }: HoursProps) => {
	const setAppointmentUser = useUserStore((state) => state.setAppointmentUser);
	const appointment = useUserStore((state) => state.user.appointment);
	const hasSchedules = !!appointment?.schedules?.length;

	function handleRadio(hour) {
		setAppointmentUser({
			serviceDateTime: hour.serviceDateTime,
			time: hour.time,
		});
	}

	return (
		<div className="acquisition-flow-rescheduling-hours">
			{isLoading ? (
				<ShimmerHours />
			) : (
				hasSchedules &&
				appointment?.schedules?.map((hour) => (
					<div
						key={hour.time}
						className="acquisition-flow-rescheduling-hours__hour-container"
						onClick={() => handleRadio(hour)}
						onKeyDown={() => handleRadio(hour)}
						data-gtm-type="form"
						data-gtm-clicktype="input"
						data-gtm-name="porto-servico:agendamento"
						data-gtm-subname={`selecione-o-dia-e-horario:${appointment.day}-de-${formatGtm(appointment.month)}:${formatGtm(hour.time)}`}
					>
						<div className="acquisition-flow-rescheduling-hours__hour">
							<Typography variant="body2">{hour.time}</Typography>
						</div>
						<Radio.Root
							variant={hour.time === appointment.time ? 'checked' : 'default'}
						>
							<Radio.Input />
						</Radio.Root>
					</div>
				))
			)}
		</div>
	);
};
