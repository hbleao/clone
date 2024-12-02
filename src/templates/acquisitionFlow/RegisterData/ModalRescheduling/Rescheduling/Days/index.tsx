import { Typography } from '@porto-ocean/typography';

import './styles.scss';

import { ShimmerDays } from './ShimmerDays';

import { useUserStore } from '@/store';

import { formatGtm } from '@/utils';

import type { DaysProps } from './types';

export const Days = ({ isLoading, state, dispatch }: DaysProps) => {
	const setAppointmentUser = useUserStore((state) => state.setAppointmentUser);
	const appointment = useUserStore((state) => state.user.appointment);

	function handleSelectedWeekDay(weekday: string) {
		return weekday.substring(0, 3);
	}

	function getDayColor(date): any {
		const sameDay = date?.day === appointment?.day;
		return {
			color: sameDay ? 'white' : 'black75',
			weight: sameDay ? 'bold' : 'regular',
			bg: sameDay && '--bg-portoSeguros100 --color-white',
		};
	}

	function handleSelectDay(date) {
		dispatch({ type: 'setReschedulingDate', payload: date });
		setAppointmentUser({
			day: date.day,
			month: date.month,
			schedules: date.schedules,
			serviceDateTime: '',
			time: '',
		});
	}

	return (
		<div className="acquisition-flow-rescheduling-days">
			<div className="acquisition-flow-rescheduling-days__scroll">
				{isLoading ? (
					<ShimmerDays />
				) : (
					appointment?.availableDays?.map((date) => (
						<div
							key={date.day}
							className={`acquisition-flow-rescheduling-days__selector ${getDayColor(date).bg}`}
							onClick={() => handleSelectDay(date)}
							onKeyDown={() => handleSelectDay(date)}
							data-gtm-type="form"
							data-gtm-clicktype="input"
							data-gtm-name="porto-servico:agendamento"
							data-gtm-subname={`selecione-o-dia-e-horario:${formatGtm(date.month)}:${formatGtm(date.weekday)}-${date.day}`}
						>
							<div className="acquisition-flow-rescheduling-days__date">
								<Typography
									variant="body2"
									as="p"
									color={getDayColor(date).color}
									weight={getDayColor(date).weight}
								>
									{handleSelectedWeekDay(date.weekday)}
								</Typography>
								<Typography
									variant="body2"
									as="p"
									color={getDayColor(date).color}
									weight={getDayColor(date).weight}
								>
									{date.day}
								</Typography>
							</div>
						</div>
					))
				)}
			</div>
			{!isLoading && !appointment?.day && (
				<div className="acquisition-flow-rescheduling-days__month">
					<Typography
						variant="label"
						as="p"
						weight="bold"
						color="portoSeguros100"
					>
						{`${appointment?.day} de ${appointment?.month}`}
					</Typography>
				</div>
			)}
		</div>
	);
};
