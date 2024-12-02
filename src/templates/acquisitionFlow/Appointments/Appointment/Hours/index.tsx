import { Typography } from '@porto-ocean/typography';

import './styles.scss';

import { ShimmerHours } from './ShimmerHours';

import * as Radio from '@/components/Radio';

import { formatGtm } from '@/utils';
import type { schedulesProps } from '../../reducer/types';
import type { HoursProps } from './types';

export const Hours = ({ isLoading, state, dispatch }: HoursProps) => {
	const hasSchedules = !!state.selectedDate?.schedules?.length;

	function handleRadio(hour: schedulesProps) {
		dispatch({ type: 'setHour', payload: hour.time });
		dispatch({ type: 'setDateTime', payload: hour.serviceDateTime });
	}

	return (
		<div className="acquisition-flow-appointments-hours">
			{isLoading ? (
				<ShimmerHours />
			) : (
				hasSchedules &&
				state.selectedDate.schedules?.map((hour) => (
					<div
						key={hour.time}
						className={`acquisition-flow-appointments-hours__hour-container ${hour.time === state.selectedHour ? 'active' : ''}`}
						onClick={() => handleRadio(hour)}
						onKeyDown={() => handleRadio(hour)}
						data-gtm-type="form"
						data-gtm-clicktype="input"
						data-gtm-name="porto-servico:agendamento"
						data-gtm-subname={`selecione-o-dia-e-horario:${state.selectedDate.day}-de-${formatGtm(state.selectedDate.month)}:${formatGtm(hour.time)}`}
					>
						<div className="acquisition-flow-appointments-hours__hour">
							<Typography variant="body2">{hour.time}</Typography>
						</div>
						<Radio.Root
							variant={hour.time === state.selectedHour ? 'checked' : 'default'}
						>
							<Radio.Input />
						</Radio.Root>
					</div>
				))
			)}
		</div>
	);
};
