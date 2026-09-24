export type PagePath = "/" | "/courses" | "/packages" | "/simulator" | "/gallery" | "/contact" | "/about" | "/payment-success" | "/payment-cancelled";

export type Package = {
  id: string;
  name: string;
  description?: string;
  lessons: string;
  includes: string[];
  price: number;
  originalPrice: number | null;
  popular: boolean;
};
