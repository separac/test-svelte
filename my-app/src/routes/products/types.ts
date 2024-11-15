export interface Product {
  id: number;
  name: string;
  description: string | null;
  msrp: string | null;
  productLink: string | null;
  affiliateLink: string | null;
  mainCategory: string | null;
  subCategory: string | null;
  brandName: string | null;
  brandWebsite: string | null;
}

export interface PageData {
  products: Product[];
}