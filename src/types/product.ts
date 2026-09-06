export interface ColorOption {
  name: string;
  value: string;
  image: string;
}

export interface Review {
  id: number;
  author: string;
  date: string;
  rating: number;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  longDescription: string;
  materials: string[];
  features: string[];
  colors: ColorOption[];
  sizes: string[];
  image: string;
  tag?: string;
}

export interface CartItem {
  id: string; // unique key: productId-colorName-size
  productId: string;
  name: string;
  price: number;
  color: ColorOption;
  size: string;
  quantity: number;
  image: string;
}

export interface ShopNotificationPayload {
  id: string;
  type: 'order' | 'cart';
  productName: string;
  colorName: string;
  size: string;
  quantity: number;
  totalPrice: number;
}
