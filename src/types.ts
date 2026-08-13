export type PagePath = "/" | "/courses" | "/packages" | "/simulator" | "/gallery" | "/contact" | "/about";

export type Package = {
  id: string;
  name: string;
  lessons: string;
  includes: string[];
  price: number;
  originalPrice: number | null;
  popular: boolean;
};
