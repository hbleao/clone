import {
	AcquisitionFlowAppointments,
	AcquisitionFlowLayout,
} from '@/templates';

import { ScheduleService } from '@/services';

export default async function Appointment() {
	return (
		<AcquisitionFlowLayout>
			<AcquisitionFlowAppointments getSchedule={ScheduleService} />
		</AcquisitionFlowLayout>
	);
}
