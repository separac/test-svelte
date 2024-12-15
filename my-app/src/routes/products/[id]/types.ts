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