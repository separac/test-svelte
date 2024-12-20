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
  brandId: string;
  brandName: string;
  brandUrl: string;
  category: string;
  categoryMain: string;
  categorySub: string;
  description: string;
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

export interface PageData {
  products: Product[];
  total: number;
  filterOptions: {
    categories: CategoryFilter[];
    brands: string[];
    priceRanges: PriceRange[];
    products: string[];
  };
  page: number;
  pageSize: string | number;
}

export interface SortState {
  field: keyof Product;
  direction: 'asc' | 'desc';
}

// Add these new types
export interface PriceRange {
  label: string;
  min: number;
  max?: number;
}

export interface CategoryFilter {
  mainCategory: string;
  subCategories: string[];
}

export interface FilterOptions {
  categories: CategoryFilter[];
  brands: string[];
  priceRanges: PriceRange[];ß
  products?: string[];
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
  type: 'category' | 'brand' | 'price' | 'product';  // Add 'product' here
  values: string[]; // For categories and brands
  ranges?: PriceRange[]; // For price ranges
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface FilterItem {
  mainCategory: string;
  subCategories: string[];
};