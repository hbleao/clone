'use client';

import useScript from './useScript';

import type { CustomDataProps } from './types';

export const SectionCustomData = ({
	pageName,
	product,
	vertical,
	subproduct,
	category,
	funnel = '',
}: CustomDataProps) => {
	useScript(pageName, product, vertical, subproduct, category, funnel);

	return <></>;
};
