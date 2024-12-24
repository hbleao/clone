export type SectionTemplateType = 
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'contact'
  | 'custom';

export interface SectionTemplate {
  id: string;
  name: string;
  type: SectionTemplateType;
  description: string;
  thumbnail?: string;
  schema: {
    fields: Array<{
      name: string;
      type: string;
      label: string;
      required?: boolean;
      options?: any[];
    }>;
  };
  defaultData?: Record<string, any>;
}

export interface PageSection {
  id: string;
  templateId: string;
  content: Record<string, any>;
  order: number;
}
