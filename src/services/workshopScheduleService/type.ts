export interface Schedule {
	time: string;
	serviceDateTime: string;
}

export interface AvailableDate {
	day: number;
	month: string;
	selected: boolean;
	weekday: string;
	schedules: Schedule[];
}
