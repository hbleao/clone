import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Page, PageProps } from './types';

export const usePageStore = create(
	persist<PageProps>(
		(set) => ({
			page: {
				steps: [],
			},
			saveConfigPage: (page: Page) => set({ page: page }),
		}),
		{
			name: '@portoservicos-page',
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
