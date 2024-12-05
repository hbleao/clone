export type ScheduleServiceProps = {
	body: {
		city?: string;
		stateCode?: string;
		latitude?: number;
		longitude?: number;
		specialtyCode?: string;
		originCode?: string;
		problemCode?: string;
	};
};

export type ScheduleServiceResponse = {
  status: number;
  selectedHour: string;
  selectedDate: Record<string, unknown>;
  availableDays: Array<{
    date: string;
    availableHours: string[];
  }>;
};
