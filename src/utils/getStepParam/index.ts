'use client';
import { usePathname } from 'next/navigation';

type Step = {
	routeParam: string;
	label: string;
	nextLink: string;
	backLink: string;
	index?: number;
	tag?: {
		name: string;
		subname: string;
	};
};

export function getStepParam(steps: Step[]): Step {
	const pathName = usePathname();
	const currentStep = pathName.split('/').pop();

	const [step] = steps
		.map((step, index) => ({ ...step, index }))
		.filter((step) => step.routeParam === currentStep);

	return step;
}
