export interface Product {
    id: number;
    name: string;
    description: string | null;
    msrp: number | null;
    currentPrice: number | null;
    productLink: string | null;
    affiliateLink: string | null;
    mainCategory: string;
    subCategory: string;
    brandName: string;
    brandWebsite: string | null;
  }
  
  export interface PageData {
    products: Product[];
  }