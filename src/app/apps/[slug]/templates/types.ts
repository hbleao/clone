export interface Template {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    pages: number;
    components: number;
  };
}
