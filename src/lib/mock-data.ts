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
    id: 'amz-1',
    name: 'Echo Pro (4th Gen) | Premium sound with Smart Hub',
    description: 'High-fidelity audio with Dolby processing. Voice control your music and smart home devices.',
    price: 99.99,
    originalPrice: 149.99,
    category: 'Electronics',
    stock: 150,
    imageUrl: 'https://picsum.photos/seed/echo1/600/600',
    rating: 4.8,
    reviews: 15420,
    isDeal: true,
    isBestSeller: true,
    brand: 'Z-Tech'
  },
  {
    id: 'amz-2',
    name: 'Kindle Paperwhite (16 GB) – 6.8” display and adjustable warm light',
    description: 'Purpose-built for reading. Flush-front design and 300 ppi glare-free display that reads like real paper.',
    price: 139.99,
    originalPrice: 159.99,
    category: 'Electronics',
    stock: 85,
    imageUrl: 'https://picsum.photos/seed/kindle/600/600',
    rating: 4.9,
    reviews: 8900,
    isDeal: false,
    isBestSeller: true,
    brand: 'Z-Reads'
  },
  {
    id: 'amz-3',
    name: 'Instant Pot Duo 7-in-1 Smart Cooker',
    description: 'Pressure cooker, rice cooker, slow cooker, yogurt maker, steamer, sauté pan and food warmer.',
    price: 79.00,
    originalPrice: 129.00,
    category: 'Home & Kitchen',
    stock: 45,
    imageUrl: 'https://picsum.photos/seed/pot/600/600',
    rating: 4.7,
    reviews: 24500,
    isDeal: true,
    brand: 'Z-Kitchen'
  },
  {
    id: 'amz-4',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    description: 'Industry leading noise canceling with 8 microphones. Up to 30-hour battery life with quick charging.',
    price: 348.00,
    originalPrice: 399.99,
    category: 'Electronics',
    stock: 30,
    imageUrl: 'https://picsum.photos/seed/sony/600/600',
    rating: 4.8,
    reviews: 12100,
    isDeal: true,
    brand: 'Sony'
  },
  {
    id: 'amz-5',
    name: 'Premium Silk Saree with Gold Zari Work',
    description: 'Exquisite traditional wear inspired by Meesho top-sellers. Perfect for festive occasions.',
    price: 45.99,
    originalPrice: 89.99,
    category: 'Fashion',
    stock: 200,
    imageUrl: 'https://picsum.photos/seed/saree/600/600',
    rating: 4.5,
    reviews: 3200,
    isDeal: true,
    brand: 'Ethnica'
  },
  {
    id: 'amz-6',
    name: 'Men\'s Casual Cotton Slim Fit Shirt',
    description: 'Breathable fabric with a modern silhouette. Ideal for office or casual outings.',
    price: 19.50,
    originalPrice: 35.00,
    category: 'Fashion',
    stock: 500,
    imageUrl: 'https://picsum.photos/seed/shirt/600/600',
    rating: 4.2,
    reviews: 15000,
    isDeal: false,
    brand: 'Flip-Trend'
  },
  {
    id: 'amz-7',
    name: 'Wireless Ergonomic Vertical Mouse',
    description: 'Reduces wrist strain and muscle pain. High precision tracking for office work.',
    price: 24.99,
    originalPrice: 39.99,
    category: 'Computing',
    stock: 120,
    imageUrl: 'https://picsum.photos/seed/mouse/600/600',
    rating: 4.4,
    reviews: 5600,
    isDeal: true,
    brand: 'Logi-Z'
  },
  {
    id: 'amz-8',
    name: 'Air Purifier for Large Rooms with HEPA Filter',
    description: 'Removes 99.97% of dust, pollen, smoke, and odors. Quiet operation for bedrooms.',
    price: 189.00,
    originalPrice: 249.00,
    category: 'Home & Kitchen',
    stock: 25,
    imageUrl: 'https://picsum.photos/seed/air/600/600',
    rating: 4.6,
    reviews: 7800,
    isDeal: false,
    brand: 'Pure-Air'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-AMZ-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    items: [{ productId: 'amz-1', quantity: 1, price: 99.99 }],
    totalAmount: 99.99,
    status: 'Processing',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ORD-AMZ-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    items: [{ productId: 'amz-4', quantity: 1, price: 348.00 }],
    totalAmount: 348.00,
    status: 'Shipped',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];
