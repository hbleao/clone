/**
 * Configurações padrão para o cálculo de altura máxima
 */
const DEFAULT_CONFIG = {
  offset: 10,
  defaultHeight: 0
};

/**
 * Calcula a altura máxima dos elementos com um determinado seletor
 * @param selector - Seletor CSS dos elementos
 * @param config - Configurações opcionais
 * @returns Altura máxima encontrada + offset
 */
export function getMaxHeight(
  selector: string,
  config: Partial<typeof DEFAULT_CONFIG> = {}
): number {
  if (typeof window === 'undefined' || !selector?.trim()) {
    return DEFAULT_CONFIG.defaultHeight;
  }

  const { offset, defaultHeight } = { ...DEFAULT_CONFIG, ...config };
  
  try {
    const elements = Array.from(document.querySelectorAll(selector));
    
    if (!elements.length) return defaultHeight;

    const maxHeight = Math.max(
      ...elements.map(el => el.clientHeight || 0)
    );

    return maxHeight > 0 ? maxHeight + offset : defaultHeight;
  } catch (error) {
    console.error('Error calculating max height:', error);
    return defaultHeight;
  }
}
