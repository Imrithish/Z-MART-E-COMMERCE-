
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  imageUrl: string;
  rating: number;
  reviews: number;
  isDeal?: boolean;
  isBestSeller?: boolean;
  brand?: string;
  features?: string[];
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: { productId: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  createdAt: string;
}

export const MOCK_PRODUCTS: Product[] = [
  // Fashion (Style & Trend)
  {
    id: 'sh-1',
    name: 'Floral Print Bohemian Maxi Dress',
    description: 'A breezy, floor-length dress featuring vibrant bohemian prints and a flattering A-line silhouette. Perfect for summer outings and beach vacations.',
    price: 3499,
    originalPrice: 4999,
    category: 'Women\'s Clothing',
    stock: 150,
    imageUrl: 'https://picsum.photos/seed/dress1/600/600',
    rating: 4.8,
    reviews: 1240,
    isDeal: true,
    brand: 'Shein Style',
    features: ['100% Rayon', 'Elastic Waist', 'V-Neckline', 'Breathable Fabric']
  },
  {
    id: 'sh-2',
    name: 'Classic Oversized Denim Jacket',
    description: 'Vintage-inspired denim jacket with a relaxed fit. Distressed detailing and heavy-duty buttons make this a timeless addition to any wardrobe.',
    price: 2899,
    originalPrice: 3500,
    category: 'Fashion',
    stock: 85,
    imageUrl: 'https://picsum.photos/seed/denim/600/600',
    rating: 4.7,
    reviews: 890,
    isDeal: false,
    brand: 'Urban Trend',
    features: ['Heavyweight Denim', 'Oversized Fit', 'Side Pockets', 'Button Closure']
  },
  {
    id: 'sh-3',
    name: 'Slim Fit Performance Joggers',
    description: 'High-performance athletic joggers designed for maximum mobility and comfort. Features moisture-wicking technology and zippered pockets.',
    price: 1999,
    originalPrice: 2499,
    category: 'Men\'s Clothing',
    stock: 200,
    imageUrl: 'https://picsum.photos/seed/joggers/600/600',
    rating: 4.6,
    reviews: 3100,
    isDeal: true,
    brand: 'Z-Sport',
    features: ['4-Way Stretch', 'Quick Dry', 'Adjustable Drawstring', 'Tapered Leg']
  },
  // Tech (Digital & Tech)
  {
    id: 'prod-1',
    name: 'Z-Phonic Max Wireless Headphones',
    description: 'Experience pure audio bliss with active noise cancellation and 40-hour battery life. Engineered for audiophiles who demand precision and comfort.',
    price: 24999,
    originalPrice: 29999,
    category: 'Audio',
    stock: 25,
    imageUrl: 'https://picsum.photos/seed/headphones/600/600',
    rating: 4.9,
    reviews: 1250,
    isDeal: true,
    isBestSeller: true,
    brand: 'Z-MART',
    features: ['Active Noise Cancellation', '40h Battery', 'Spatial Audio', 'USB-C Charging']
  },
  {
    id: 'prod-14',
    name: 'Z-Phone 15 Flagship',
    description: 'The future of mobile is here. Professional triple-camera system, A17 Bionic chip, and a Titanium build that feels as good as it looks.',
    price: 79999,
    originalPrice: 89999,
    category: 'Mobiles',
    stock: 50,
    imageUrl: 'https://picsum.photos/seed/phone/600/600',
    rating: 4.8,
    reviews: 5400,
    isDeal: true,
    brand: 'Z-MART',
    features: ['Triple Camera System', 'A17 Chip', 'Dynamic Island', 'Titanium Frame']
  },
  // Home (Home & Life)
  {
    id: 'hm-1',
    name: 'Mid-Century Velvet Accent Chair',
    description: 'Elegant accent chair with plush velvet upholstery and gold-finished metal legs. Adds a touch of luxury to any living room or bedroom.',
    price: 14500,
    originalPrice: 18000,
    category: 'Furniture',
    stock: 12,
    imageUrl: 'https://picsum.photos/seed/chair-velvet/600/600',
    rating: 4.9,
    reviews: 450,
    isDeal: false,
    brand: 'LuxeHome',
    features: ['Soft Velvet', 'Ergonomic Design', 'Easy Assembly', 'Weight Capacity: 120kg']
  },
  {
    id: 'hm-2',
    name: 'Minimalist Ceramic Vase Set',
    description: 'Handcrafted ceramic vases in matte neutral tones. Perfect for minimalist decor or as a standalone centerpiece.',
    price: 2499,
    originalPrice: 3200,
    category: 'Decor',
    stock: 45,
    imageUrl: 'https://picsum.photos/seed/vase/600/600',
    rating: 4.7,
    reviews: 120,
    isDeal: true,
    brand: 'Artisanal',
    features: ['Set of 3', 'High-Fired Ceramic', 'Non-Slip Base', 'Matte Finish']
  },
  // Beauty (Beauty & Wellness)
  {
    id: 'bt-1',
    name: 'Luminous Hydration Facial Oil',
    description: 'A blend of rare botanical oils that deeply hydrates and nourishes the skin. Non-greasy formula for an instant glow.',
    price: 1299,
    originalPrice: 1599,
    category: 'Skincare',
    stock: 300,
    imageUrl: 'https://picsum.photos/seed/oil/600/600',
    rating: 4.8,
    reviews: 2100,
    isDeal: true,
    brand: 'Glow Up',
    features: ['Pure Rosehip Oil', 'Vitamin E', 'Cold-Pressed', 'Cruelty-Free']
  },
  {
    id: 'bt-2',
    name: 'Silk Finish Matte Lipstick Set',
    description: 'A collection of 6 long-wear matte lipsticks. Pigment-rich formula that doesn\'t dry out the lips.',
    price: 1800,
    originalPrice: 2200,
    category: 'Makeup',
    stock: 150,
    imageUrl: 'https://picsum.photos/seed/lipstick/600/600',
    rating: 4.5,
    reviews: 3400,
    isDeal: false,
    brand: 'Velvet Beauty',
    features: ['12-Hour Wear', 'Transfer-Proof', 'Includes 6 Shades', 'Paraben Free']
  },
  {
    id: 'sh-4',
    name: 'Retro Round Sunglasses',
    description: 'Classic round-frame sunglasses with polarized lenses. Lightweight acetate frame for all-day comfort.',
    price: 1200,
    originalPrice: 1800,
    category: 'Accessories',
    stock: 500,
    imageUrl: 'https://picsum.photos/seed/sunnies/600/600',
    rating: 4.6,
    reviews: 4200,
    isDeal: true,
    brand: 'Vogue Optix',
    features: ['UV400 Protection', 'Polarized Lenses', 'Hard Case Included', 'Microfiber Cloth']
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Demo User',
    customerEmail: 'demo@example.com',
    items: [{ productId: 'sh-1', quantity: 1, price: 3499 }],
    totalAmount: 3499,
    status: 'Processing',
    createdAt: new Date().toISOString(),
  }
];
