// src/lib/types.ts
export type BrandLogoType = 'simple-icon' | 'custom-svg' | 'wordmark';

export interface BrandLogo {
  type: BrandLogoType;
  value: string;
  backgroundColor?: string;
}

export interface Brand {
  id: string;
  name: string;
  category: string;
  website: string;
  description?: string;
  logo: BrandLogo;
}

export interface BrandEntity {
  id: number;
  name: string;           // Used in page.svelte
  brandName: string;      // Used in carousel
  mainCategory: string | null;
  subCategory: string | null;
  category?: {
    main_category: string;
    sub_category: string;
  };
  brandDescription: string;
  website?: string;      // Used in page.svelte
  brandWebsite?: string; // Used in carousel
  logo?: {
    type: 'simple-icon' | 'custom-svg' | 'wordmark';
    value?: string;
    backgroundColor?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  /**brand: {
    id: string;
    name: string;
    url: string;
  };
  category: {
    main: string;
    sub: string;
  };**/
  brandId: string;
  brandName: string;
  brandUrl: string;
  categoryMain: string;
  categorySub: string;
  description: string;  // Make sure this exists and is exposed
  msrp: number;
  images: string[];
  likes: string[];
  dislikes: string[];
  productLink: string;
  affiliateLink: {
    retailer: string;
    price: number;
    url: string;
  
  }[];
  warrantyInfo: string;
  materials: {
    name: string;
    percentage: number;
  }[];
  countryOfOrigin: string;
  yearIntroduced: number;
  containsPfas: boolean;
  authorNotes?: string;
  lastUpdated: string;
}

export interface Material {
  name: string;
  percentage: number;
}

export interface AffiliateLink {
  retailer: string;
  price: number;
  url: string;
}

export interface ProductImage {
  url: string;
}

export interface Category {
  main: string;
  sub: string;
}

// Remove duplicate interfaces and consolidate filter types
export interface FilterValue {
  value: string;
  label: string;
}

export interface PriceRange {
  value: string;
  label: string;
  min: number;
  max?: number;
}

export interface FilterOptions {
  categories: {
    type: 'category';
    values: CategoryFilter[];
  };
  brands: {
    type: 'brand';
    values: FilterValue[];
  };
  prices: {
    type: 'price';
    values: PriceRange[];
  };
  products: {
    type: 'product';
    values: FilterValue[];
  };
}

// Ensure CategoryFilter includes proper typing
export interface CategoryFilter {
  mainCategory: string;
  subCategories: string[];
  value: string;
  label: string;
}

// Update PageData to use the new FilterOptions
export interface PageData {
  products: Product[];
  total: number;
  filterOptions: FilterOptions;
  page: number;
  pageSize: number;
}

export interface SortState {
  field: keyof Product;
  direction: 'asc' | 'desc';
}

// Modify ColumnDef to include filterType
export interface ColumnDef {
  key: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  filterable: boolean;
  filterType?: 'category' | 'brand' | 'price' | 'product';  // Add 'product' here
}

// Update Filter type
export interface Filter {
  type: 'category' | 'brand' | 'price';
  values: string[]; // For categories and brands
  ranges?: PriceRange[]; // For price ranges
}

export interface PaginationState {
  page: number;
  pageSize: number;
}