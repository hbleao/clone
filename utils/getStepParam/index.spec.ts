import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStepParam } from './getStepParam';
import { usePathname } from 'next/navigation';

vi.mock('next/navigation', () => ({
	usePathname: vi.fn(),
}));

describe('getStepParam', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should return the matching step with an index', () => {
		vi.mocked(usePathname).mockReturnValue('/steps/step1');

		const steps = [
			{ routeParam: 'step1', label: 'Step 1', nextLink: '/steps/step2', backLink: '/' },
			{ routeParam: 'step2', label: 'Step 2', nextLink: '/steps/step3', backLink: '/steps/step1' },
		];

		const result = getStepParam(steps);

		expect(result).toEqual({
			routeParam: 'step1',
			label: 'Step 1',
			nextLink: '/steps/step2',
			backLink: '/',
			index: 0,
		});
	});

	it('should throw an error if the pathname is not available', () => {
		vi.mocked(usePathname).mockReturnValue(null);

		const steps = [
			{ routeParam: 'step1', label: 'Step 1', nextLink: '/steps/step2', backLink: '/' },
		];

		expect(() => getStepParam(steps)).toThrow('Pathname is not available.');
	});

	it('should throw an error if no step matches the route parameter', () => {
		vi.mocked(usePathname).mockReturnValue('/steps/nonexistent');

		const steps = [
			{ routeParam: 'step1', label: 'Step 1', nextLink: '/steps/step2', backLink: '/' },
		];

		expect(() => getStepParam(steps)).toThrow('Step not found for route parameter: nonexistent');
	});
});
