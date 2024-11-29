import type { HttpResponseHomeProps } from './types';

function removeNumbers(sectionName: string) {
	const newSectionName = sectionName.replace(/[0-9]/g, '');

	return newSectionName.endsWith('_')
		? newSectionName.substring(0, newSectionName.length - 1)
		: newSectionName;
}

function findSectionHeader(obj: any): any {
	if (!obj || typeof obj !== 'object') return null;
	if (obj[':type'] === 'porto/react-components/section-header') {
		return obj;
	}

	for (const key of Object.keys(obj)) {
		const result = findSectionHeader(obj[key]);
		if (result) return result;
	}

	return null;
}

export const AEMService = {
	getContent: async (endpoint: any): Promise<HttpResponseHomeProps> => {
		const response = await fetch(endpoint, {
			next: {
				revalidate: 1,
			},
		});

		const data = await response.json();
		const rootProps = data[':items']?.root[':items'] || {};

		const header =
			rootProps?.experiencefragment?.[':items']?.root?.[':items']?.header;
		const footer =
			rootProps?.['experiencefragment-footer']?.[':items']?.root?.[':items']
				?.footer;

		const Sections = rootProps?.responsivegrid?.[':items'] || {};

		const sectionHeader = findSectionHeader(data);

		const listSections = Object.entries(Sections);

		const listSectionsWithoutSpacing = listSections.filter(
			(section) => !section[0].includes('spacing'),
		);

		function generateId() {
			return (
				Math.random().toString(36).substring(2, 15) +
				Math.random().toString(36).substring(2, 15)
			);
		}

		const formattedListSections = listSectionsWithoutSpacing.map((section) => ({
			_uid: generateId(),
			name: removeNumbers(section[0]),
			component: section[1],
		}));

		const formattedResponse = [
			{
				_uid: generateId(),
				name: 'header',
				component: header,
			},

			sectionHeader && {
				_uid: generateId(),
				name: 'section-header',
				component: sectionHeader,
			},
			...formattedListSections,
			{
				_uid: generateId(),
				name: 'footer',
				component: footer,
			},
		].filter(Boolean);

		return {
			data,
			sections: formattedResponse,
		};
	},
};
