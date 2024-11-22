// src/routes/brands/types.ts
export interface Brand {
  id: string;
  brandName: string;
  mainCategory: string | null;
  subCategory: string | null;
  brandDescription: string | null;
  brandWebsite: string | null;
}

export interface CarouselBrand {
  id: string;
  name: string;
  category: string;
  website: string;
  description?: string | null;
  logo: {
    type: 'simple-icon' | 'custom-svg' | 'wordmark';
    value?: string;
    backgroundColor?: string;
  };
}

export interface PageData {
  brands: Brand[];
  featuredBrands: Brand[];
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