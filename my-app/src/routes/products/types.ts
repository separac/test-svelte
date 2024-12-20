// types.ts
export interface Product {
  id: string;
  name: string;
  description?: string;
  mainCategory: string;
  subCategory: string;
  brandName: string;
  brandWebsite?: string;
  productLink?: string;
  msrp: number;
}

export interface PageData {
  products: Product[];
  total: number;
}

export interface SortState {
  field: keyof Product;
  direction: 'asc' | 'desc';
}

export interface ColumnDef {
  key: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  activeFilters?: Filter[];
}

export interface Filter {
  type: string;
  value: string;
  value2?: string;
  column?: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
}