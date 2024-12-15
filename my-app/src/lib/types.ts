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
  affiliateLinks: {
    retailer: string;
    price: number;
    url: string;
  }[];
  specs: {
    countryOfOrigin: string;
    yearIntroduced: number;
    pfasFree: boolean;
    materials: {
      name: string;
      percentage: number;
    }[];
    warranty: {
      type: string;
      details: string;
    };
  };
  communityFeedback: {
    likes: string[];
    considerations: string[];
  };
  authorNotes?: string;
  lastUpdated: string;
}