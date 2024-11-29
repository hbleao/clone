import type { HttpResponseHomeProps } from './types';

/**
 * Remove números de um nome de seção e remove o caractere de sublinhado final, se existir.
 * @param sectionName Nome da seção a ser formatado.
 * @returns Nome da seção sem números e sem sublinhado final.
 */
function removeNumbers(sectionName: string): string {
    const sanitized = sectionName.replace(/[0-9]/g, '');
    return sanitized.endsWith('_') ? sanitized.slice(0, -1) : sanitized;
}

/**
 * Procura recursivamente por um objeto que contenha a propriedade ':type' com valor específico.
 * @param obj Objeto no qual buscar.
 * @returns O objeto encontrado ou null se não encontrado.
 */
function findSectionHeader(obj: Record<string, any>): any | null {
    if (!obj || typeof obj !== 'object') return null;

    if (obj[':type'] === 'porto/react-components/section-header') {
        return obj;
    }

    for (const key in obj) {
        const result = findSectionHeader(obj[key]);
        if (result) return result;
    }

    return null;
}

/**
 * Gera um identificador único para ser usado como `_uid`.
 * @returns String única gerada aleatoriamente.
 */
function generateId(): string {
    return `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
}

/**
 * Serviço para manipular e formatar o conteúdo recebido de uma API AEM.
 */
export const AEMService = {
    /**
     * Obtém e formata o conteúdo da API AEM.
     * @param endpoint URL do endpoint para buscar os dados.
     * @returns Conteúdo formatado, incluindo cabeçalho, seções e rodapé.
     */
    getContent: async (endpoint: string): Promise<HttpResponseHomeProps> => {
        const response = await fetch(endpoint, {
            next: { revalidate: 1 },
        });

        const data = await response.json();
        const rootItems = data[':items']?.root[':items'] || {};

        // Extração das partes principais do conteúdo
        const header = rootItems?.experiencefragment?.[':items']?.root?.[':items']?.header;
        const footer = rootItems?.['experiencefragment-footer']?.[':items']?.root?.[':items']?.footer;
        const sections = rootItems?.responsivegrid?.[':items'] || {};

        // Identificação do cabeçalho da seção (se existir)
        const sectionHeader = findSectionHeader(data);

        // Filtragem e formatação das seções
        const formattedSections = Object.entries(sections)
            .filter(([key]) => !key.includes('spacing')) // Remove seções de espaçamento
            .map(([key, component]) => ({
                _uid: generateId(),
                name: removeNumbers(key),
                component,
            }));

        // Construção da resposta final formatada
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
            ...formattedSections,
            {
                _uid: generateId(),
                name: 'footer',
                component: footer,
            },
        ].filter(Boolean); // Remove elementos nulos ou indefinidos

        return {
            data,
            sections: formattedResponse,
        };
    },
};
