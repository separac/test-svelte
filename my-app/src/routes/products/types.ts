// types.ts
export interface Product {
  id: number;
  name: string;
  description: string | null;
  msrp: number | null;
  productLink: string | null;
  affiliateLink: string | null;
  mainCategory: string | null;
  subCategory: string | null;
  brandName: string | null;
  brandWebsite: string | null;
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
  key: keyof Product;
  label: string;
  visible: boolean;
}

export interface PaginationState {
  page: number;
  pageSize: number;
}