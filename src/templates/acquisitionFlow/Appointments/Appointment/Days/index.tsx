import { Typography } from '@porto-ocean/typography';

import { joinClasses } from '@porto-ocean/utils';

import './styles.scss';

import { ShimmerDays } from './ShimmerDays';

import { formatGtm } from '@/utils';
import type { DaysProps } from './types';

export const Days = ({ isLoading, state, dispatch, variant }: DaysProps) => {
	function handleSelectedWeekDay(weekday: string) {
		return weekday.substring(0, 3);
	}

	function getDayColor(date): any {
		const sameDay = date?.day === state.selectedDate?.day;
		return {
			color: sameDay ? 'white' : 'black75',
			weight: sameDay ? 'bold' : 'regular',
			bg: sameDay && '--bg-portoSeguros100 --color-white',
		};
	}

	function handleSelectDay(date) {
		dispatch({ type: 'setDate', payload: date });
	}

	return (
		<div className="acquisition-flow-appointment-days">
			<div
				className={joinClasses([
					'acquisition-flow-appointment-days__scroll',
					variant === 'caps' ? 'scrollable-horizontal' : '',
				])}
			>
				{isLoading ? (
					<ShimmerDays />
				) : (
					state?.availableDays?.map((date) => (
						<div
							key={date.day}
							className={`acquisition-flow-appointment-days__selector ${getDayColor(date).bg}`}
							onClick={() => handleSelectDay(date)}
							onKeyDown={() => handleSelectDay(date)}
							data-gtm-type="form"
							data-gtm-clicktype="input"
							data-gtm-name="porto-servico:agendamento"
							data-gtm-subname={`selecione-o-dia-e-horario:${formatGtm(date.month)}:${formatGtm(date.weekday)}-${date.day}`}
						>
							<div className="acquisition-flow-appointment-days__date">
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
			{!isLoading && !state.selectedDate?.day && (
				<div className="acquisition-flow-appointment-days__month">
					<Typography
						variant="label"
						as="p"
						weight="bold"
						color="portoSeguros100"
					>
						{`${state.selectedDate.day} de ${state.selectedDate.month}`}
					</Typography>
				</div>
			)}
		</div>
	);
};
