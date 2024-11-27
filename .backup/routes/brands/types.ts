// src/routes/brands/types.ts
import type { PageServerData } from './$types';

export interface Brand {
  id: number;  // Keep as number to match server
  mainCategory: string | null;
  subCategory: string | null;
  brandName: string;
  brandDescription: string;
  brandWebsite: string | null;
}

export interface CarouselBrand extends Brand {
  logo: {
    type: 'simple-icon' | 'custom-svg' | 'wordmark';
    value?: string;
    backgroundColor?: string;
  };
}

export interface PageData {
  brands: Brand[];
  features: Brand[];
  total: number;
}

export interface ColumnDef {
  key: keyof Brand;
  label: string;
  visible: boolean;
  sortable: boolean;
}

export interface SortState {
  field: keyof Brand;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
}
