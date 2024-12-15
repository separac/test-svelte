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
  brand: {
    id: string;
    name: string;
    url: string;
  };
  category: {
    main: string;
    sub: string;
  };
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