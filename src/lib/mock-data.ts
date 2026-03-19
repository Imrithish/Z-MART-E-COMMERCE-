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
  {
    id: '1',
    name: 'Pro Wireless Over-Ear Headphones',
    description: 'Noise-cancelling, 40-hour battery life, and spatial audio support.',
    price: 149.99,
    originalPrice: 299.99,
    category: 'Electronics',
    stock: 45,
    imageUrl: 'https://picsum.photos/seed/z1/600/600',
    rating: 4.8,
    reviews: 1240,
    isDeal: true,
  },
  {
    id: '2',
    name: 'Smart Home Hub 2.0',
    description: 'Control your entire home with voice commands and automated routines.',
    price: 89.50,
    originalPrice: 129.99,
    category: 'Home Automation',
    stock: 20,
    imageUrl: 'https://picsum.photos/seed/z2/600/600',
    rating: 4.5,
    reviews: 850,
    isDeal: true,
  },
  {
    id: '3',
    name: 'Ergonomic Task Chair',
    description: 'Breathable mesh back with lumbar support for long working hours.',
    price: 199.00,
    originalPrice: 249.00,
    category: 'Furniture',
    stock: 12,
    imageUrl: 'https://picsum.photos/seed/z3/600/600',
    rating: 4.2,
    reviews: 420,
  },
  {
    id: '4',
    name: 'RGB Mechanical Gaming Keyboard',
    description: 'Swappable switches and customizable lighting for enthusiasts.',
    price: 74.99,
    originalPrice: 89.99,
    category: 'Computing',
    stock: 60,
    imageUrl: 'https://picsum.photos/seed/z4/600/600',
    rating: 4.7,
    reviews: 2100,
  },
  {
    id: '5',
    name: 'Ultra HD 4K Action Camera',
    description: 'Waterproof up to 30m with dual screens and 60fps recording.',
    price: 59.99,
    originalPrice: 99.99,
    category: 'Electronics',
    stock: 35,
    imageUrl: 'https://picsum.photos/seed/z5/600/600',
    rating: 4.4,
    reviews: 670,
    isDeal: true,
  },
  {
    id: '6',
    name: 'Nordic Ceramic Coffee Set',
    description: 'Elegant 6-piece set with gold-rimmed edges and matching tray.',
    price: 45.00,
    originalPrice: 65.00,
    category: 'Home & Kitchen',
    stock: 15,
    imageUrl: 'https://picsum.photos/seed/z6/600/600',
    rating: 4.9,
    reviews: 120,
  },
  {
    id: '7',
    name: 'Performance Running Shoes',
    description: 'Lightweight cushioning for marathons and daily jogs.',
    price: 110.00,
    originalPrice: 150.00,
    category: 'Fashion',
    stock: 80,
    imageUrl: 'https://picsum.photos/seed/z7/600/600',
    rating: 4.6,
    reviews: 3400,
  },
  {
    id: '8',
    name: 'Organic Bamboo Bedding',
    description: 'Silky smooth sheets that keep you cool all night long.',
    price: 68.00,
    originalPrice: 85.00,
    category: 'Home & Kitchen',
    stock: 25,
    imageUrl: 'https://picsum.photos/seed/z8/600/600',
    rating: 4.3,
    reviews: 1100,
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    items: [{ productId: '1', quantity: 1, price: 149.99 }],
    totalAmount: 149.99,
    status: 'Processing',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    items: [{ productId: '2', quantity: 1, price: 89.50 }],
    totalAmount: 89.50,
    status: 'Shipped',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];