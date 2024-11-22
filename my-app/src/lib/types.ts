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