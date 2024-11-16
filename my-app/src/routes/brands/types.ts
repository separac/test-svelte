// types.ts
export interface Brand {
    id: string;
    brandName: string;
    mainCategory: string | null;
    subCategory: string | null;
    brandDescription: string | null;
    brandWebsite: string | null;
  }
  
  export interface PageData {
    brands: Brand[];
    total: number;
  }
  
  export interface ColumnDef {
    key: keyof Brand;
    label: string;
    visible: boolean;
  }
  
  export interface SortState {
    field: keyof Brand;
    direction: 'asc' | 'desc';
  }
  
  export interface PaginationState {
    page: number;
    pageSize: number;
  }