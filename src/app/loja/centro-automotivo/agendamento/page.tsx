'use server';

import { AcquisitionFlowAppointments, WorkshopFlowLayout } from '@/templates';

import { WorkshopScheduleService } from '@/services';

export default async function Appointment() {
	return (
		<WorkshopFlowLayout>
			<AcquisitionFlowAppointments
				getSchedule={WorkshopScheduleService}
				variant="caps"
			/>
		</WorkshopFlowLayout>
	);
}
