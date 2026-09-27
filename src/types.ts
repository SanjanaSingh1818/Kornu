export type PagePath = "/" | "/courses" | "/packages" | "/simulator" | "/gallery" | "/contact" | "/about" | "/payment-success" | "/payment-cancelled";

export type ProductCategory = "all" | "driving-lesson-package" | "best-prices" | "courses" | "start-up-package" | "total-package";

export type CatalogProduct = {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  priceId?: string;
  lessons?: string;
  duration?: string;
  features: string[];
  popular?: boolean;
  badge?: string;
  sortOrder?: number;
  collections: string[];
  image?: string | null;
  originalPrice?: number | null;
};

export type Package = CatalogProduct & {
  includes: string[];
};
