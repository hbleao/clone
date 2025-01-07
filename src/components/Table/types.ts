export type Column<T> = {
  key: keyof T | string;
  title: string;
  render?: (item: T) => React.ReactNode;
};

export type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  itemsPerPage?: number;
  onRowClick?: (item: T) => void;
};
