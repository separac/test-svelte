// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
// src/app.d.ts
import type { PageData as BasePageData } from './$types';

export interface PageData extends BasePageData {
  // Add any additional properties you need here
  products: Product[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  mainCategory: string;
  subCategory: string;
  brandName: string;
  brandWebsite: string;
  currentPrice: number;
  msrp: number;
  productLink: string;
  affiliateLink: string;
}
export {};
