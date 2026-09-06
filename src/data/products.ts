import { Product } from '@/types/product';

export const SIZE_PRICES: Record<string, number> = {
  XS: 299,
  S: 299,
  M: 299,
  L: 299,
  XL: 319,
  '2XL': 339,
  XXL: 339,
  '3XL': 359,
  XXXL: 359,
};

export function getPriceForSize(size: string, basePrice: number = 299): number {
  if (!size) return basePrice;
  const key = size.trim().toUpperCase();
  if (SIZE_PRICES[key] !== undefined) {
    return SIZE_PRICES[key];
  }
  return basePrice;
}

export function getSizeDisplayName(size: string): string {
  switch (size.toUpperCase()) {
    case 'XS':
      return 'Extra Small (XS)';
    case 'S':
      return 'Small (S)';
    case 'M':
      return 'Medium (M)';
    case 'L':
      return 'Large (L)';
    case 'XL':
      return 'XL';
    case '2XL':
    case 'XXL':
      return '2XL';
    case '3XL':
    case 'XXXL':
      return '3XL';
    default:
      return size;
  }
}

export const PRODUCTS: Product[] = [
  {
    id: 'essential-tee',
    name: 'Modaline Essential Tee',
    category: 'Modaline Essentials',
    price: 299,
    rating: 5.0,
    reviewCount: 128,
    description: 'Designed for everyday comfort as a Plain Cotton-Polyester T-Shirt. Lightweight, breathable, and durable for everyday wear.',
    longDescription: 'The Modaline is designed for everyday comfort, crafted as a Plain Cotton-Polyester T-Shirt for a comfortable balance of softness and durability. Its versatile design makes it easy to wear on its own or pair with your favorite outfits.\n\nSimple, comfortable, and made for everyday wear—the Modaline Essential Tee brings together practical quality and timeless style at an affordable price.',
    materials: [
      'Composition: Plain Cotton-Polyester T-Shirt',
      'Feel: Comfortable, soft, and durable',
      'Style: Classic everyday design',
    ],
    features: [
      'Soft Cotton Blend',
      'Breathable Fabric',
      'Everyday Comfort',
      'Durable Stitching',
      'Machine Washable',
    ],
    colors: [
      { name: 'Black', value: '#0a0a0a', image: '/images/products/black.png' },
      { name: 'White', value: '#f8f8f8', image: '/images/products/white.png' },
      { name: 'Navy Blue', value: '#0a1628', image: '/images/products/navy_blue.png' },
      { name: 'Royal Blue', value: '#0550c6', image: '/images/products/Blue.png' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    image: '/images/products/black.png',
    tag: 'Best Seller',
  },
  {
    id: 'heavy-tee',
    name: 'Modaline Heavy Tee',
    category: 'Heavyweight Series',
    price: 299,
    rating: 4.9,
    reviewCount: 84,
    description: 'Heavyweight 240 GSM organic cotton blend tee featuring an oversized relaxed silhouette and structured drop shoulder.',
    longDescription: 'Engineered for structure and warmth, the Modaline Heavy Tee brings street style aesthetic together with luxury fabric weight. High-density knit ensures zero see-through and crisp boxy lines.',
    materials: [
      'Composition: Plain Cotton-Polyester T-Shirt',
      'Feel: Comfortable, soft, and durable',
      'Style: Classic everyday design',
    ],
    features: [
      'Oversized Boxy Fit',
      'Heavy 240 GSM Knit',
      'Drop Shoulder Cut',
      'Anti-Shrink Treated',
    ],
    colors: [
      { name: 'Black', value: '#0a0a0a', image: '/images/products/black.png' },
      { name: 'White', value: '#f8f8f8', image: '/images/products/white.png' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    image: '/images/products/black.png',
    tag: 'Oversized Fit',
  },
  {
    id: 'minimal-crew',
    name: 'Modaline Minimalist Crew',
    category: 'Minimal Collection',
    price: 299,
    rating: 4.8,
    reviewCount: 96,
    description: 'Clean, subtle branding with tonal embroidery on ultra-soft combed cotton blend.',
    longDescription: 'For those who appreciate clean minimalism. The Minimalist Crew features hidden seams, tonal Modaline micro-logo embroidery, and an athletic fit that hugs the shoulders while draping cleanly.',
    materials: [
      'Composition: Plain Cotton-Polyester T-Shirt',
      'Feel: Comfortable, soft, and durable',
      'Style: Classic everyday design',
    ],
    features: [
      'Tonal Micro Logo',
      'Silicone Wash Softness',
      'Athletic Tailored Cut',
      'Tagless Comfort Label',
    ],
    colors: [
      { name: 'White', value: '#f8f8f8', image: '/images/products/white.png' },
      { name: 'Navy Blue', value: '#0a1628', image: '/images/products/navy_blue.png' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    image: '/images/products/white.png',
    tag: 'Regular Fit',
  },
  {
    id: 'royal-edition',
    name: 'Modaline Royal Edition',
    price: 299,
    rating: 5.0,
    reviewCount: 62,
    category: 'Limited Series',
    description: 'Signature vibrant electric Royal Blue colorway with moisture-wicking technology.',
    longDescription: 'Stand out with the Modaline Royal Edition. Dyed with fade-resistant eco-dyes to retain its radiant luster wear after wear.',
    materials: [
      'Composition: Plain Cotton-Polyester T-Shirt',
      'Feel: Comfortable, soft, and durable',
      'Style: Classic everyday design',
    ],
    features: [
      'Vibrant Fade-Resistant Dye',
      'Moisture Wicking Finish',
      'Reinforced Hems',
    ],
    colors: [
      { name: 'Royal Blue', value: '#0550c6', image: '/images/products/Blue.png' },
      { name: 'Navy Blue', value: '#0a1628', image: '/images/products/navy_blue.png' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    image: '/images/products/Blue.png',
    tag: 'Limited Color',
  },
];

export function getProductById(id: string): Product {
  return PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
}
