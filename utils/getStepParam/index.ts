

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

/**
 * Obtém o passo atual com base no parâmetro de rota da URL.
 * @param steps Lista de passos com informações de navegação.
 * @returns O passo correspondente ao parâmetro da rota ou lança um erro se não encontrar.
 */
export function getStepParam(steps: Step[]): Step {
	// Obter o caminho atual da URL
	const pathName = usePathname();
	if (!pathName) {
		throw new Error('Pathname is not available.');
	}

	// Extrair o último segmento do caminho
	const currentStep = pathName.split('/').pop();

	// Encontrar o passo correspondente
	const stepWithIndex = steps
		.map((step, index) => ({ ...step, index }))
		.find((step) => step.routeParam === currentStep);

	if (!stepWithIndex) {
		throw new Error(`Step not found for route parameter: ${currentStep}`);
	}

	return stepWithIndex;
}
