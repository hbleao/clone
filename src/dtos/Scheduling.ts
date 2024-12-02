export type IScheduling = {
	day: string;
	month: string;
	schedules: {
		time: string;
		serviceDateTime: string;
	}[];
	selected: boolean;
	weekday: string;
};
