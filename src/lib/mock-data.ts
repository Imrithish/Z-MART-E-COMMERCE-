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
    price: 9999,
    originalPrice: 14999,
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
    price: 13999,
    originalPrice: 15999,
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
    price: 7900,
    originalPrice: 12900,
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
    price: 29990,
    originalPrice: 34990,
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
    price: 4599,
    originalPrice: 8999,
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
    price: 1499,
    originalPrice: 2499,
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
    price: 2499,
    originalPrice: 3999,
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
    price: 15999,
    originalPrice: 21999,
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
    items: [{ productId: 'amz-1', quantity: 1, price: 9999 }],
    totalAmount: 9999,
    status: 'Processing',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ORD-AMZ-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    items: [{ productId: 'amz-4', quantity: 1, price: 29990 }],
    totalAmount: 29990,
    status: 'Shipped',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];
