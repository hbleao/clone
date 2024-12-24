'use client';

import type { FormElementInstance } from '@/components/FormElements';

export type PropertiesComponentProps = {
	elementInstance: FormElementInstance;
};

export const PropertiesComponent = ({
	elementInstance,
}: PropertiesComponentProps) => {
	return <p>No properties for this element.</p>;
};
