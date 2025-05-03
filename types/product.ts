export interface Product {
    _id: string;
    name: string;
    price: number;
    unit: string;
    stock?: number;
    category?: string;
    available?: boolean;
    image?: {
      url: string;
      blurDataUrl?: string;
    };
  }
  