export interface getScheduleParams {
	body?: any;
	code?: string;
}

export interface AcquisitionFlowAppointmentsProps {
	getSchedule: (params: getScheduleParams) => Promise<any>;
	variant?: 'default' | 'caps';
}
