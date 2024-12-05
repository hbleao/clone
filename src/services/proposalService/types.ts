import type { IScheduling } from '@/dtos';

export type ProposalServiceResponse = {
  idLead?: string;
  status: number;
  newSchedule?: IScheduling[];
  result?: Record<string, unknown>;
};
