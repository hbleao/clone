import type { HttpResponseHomeProps } from './types';

function removeNumbers(sectionName: string): string {
  const newSectionName = sectionName.replace(/[0-9]/g, '');
  return newSectionName.endsWith('_')
    ? newSectionName.slice(0, -1)
    : newSectionName;
}

function findSectionHeader(obj: Record<string, any>): Record<string, any> | null {
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
  getContent: async (endpoint: string): Promise<HttpResponseHomeProps> => {
    try {
      const response = await fetch(endpoint, {
        next: { revalidate: 1 },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const rootProps = data[':items']?.root[':items'] ?? {};

      const header = rootProps?.experiencefragment?.[':items']?.root?.[':items']?.header;
      const footer = rootProps?.['experiencefragment-footer']?.[':items']?.root?.[':items']?.footer;
      const sections = rootProps?.responsivegrid?.[':items'] ?? {};
      const sectionHeader = findSectionHeader(data);

      const filteredSections = Object.entries(sections)
        .filter(([key]) => !key.includes('spacing'))
        .map(([key, value]) => ({
          name: removeNumbers(key),
          value,
        }));

      return {
        data,
        sections: [
          {
            _uid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            name: 'header',
            component: header,
          },
          sectionHeader && {
            _uid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            name: 'section-header',
            component: sectionHeader,
          },
          ...filteredSections.map((section) => ({
            _uid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            name: section.name,
            component: section.value,
          })),
          {
            _uid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            name: 'footer',
            component: footer,
          },
        ].filter(Boolean),
      };
    } catch (error) {
      console.error('Error in AEMService.getContent:', error);
      return {
        data: null,
        sections: [],
      };
    }
  },
};
