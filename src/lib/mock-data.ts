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
  {
    id: 'amz-ip15',
    name: 'Apple iPhone 15 (128 GB) - Blue',
    description: 'DYNAMIC ISLAND COMES TO IPHONE 15 — Dynamic Island bubbles up alerts and Live Activities — so you don’t miss them while you’re doing something else. You can see who’s calling, check your flight status and so much more.',
    price: 71200,
    originalPrice: 79900,
    category: 'Electronics',
    stock: 50,
    imageUrl: 'https://picsum.photos/seed/iphone15/600/600',
    rating: 4.6,
    reviews: 2450,
    isDeal: true,
    isBestSeller: true,
    brand: 'Apple',
    features: ['48MP Main Camera', 'A16 Bionic chip', 'USB-C Charging', 'All-day battery life']
  },
  {
    id: 'amz-echo4',
    name: 'Echo Dot (5th Gen) | Smart speaker with Alexa',
    description: 'Our best sounding Echo Dot yet — Enjoy an improved audio experience compared to any previous Echo Dot with Alexa for clearer vocals, deeper bass and vibrant sound in any room.',
    price: 4999,
    originalPrice: 5499,
    category: 'Electronics',
    stock: 200,
    imageUrl: 'https://picsum.photos/seed/echo5/600/600',
    rating: 4.5,
    reviews: 15800,
    isDeal: true,
    isBestSeller: true,
    brand: 'Amazon',
    features: ['Motion Detection', 'Temperature Sensor', 'Rich Sound', 'Privacy Controls']
  },
  {
    id: 'amz-kindle11',
    name: 'Kindle Paperwhite (16 GB) – 6.8” display',
    description: 'Now with a 6.8” display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.',
    price: 13999,
    originalPrice: 14999,
    category: 'Electronics',
    stock: 75,
    imageUrl: 'https://picsum.photos/seed/kindlepw/600/600',
    rating: 4.8,
    reviews: 5200,
    isDeal: false,
    isBestSeller: true,
    brand: 'Amazon',
    features: ['300 ppi Display', 'Waterproof (IPX8)', 'USB-C', 'Adjustable Warm Light']
  },
  {
    id: 'amz-sony-wh',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    description: 'Industry-leading noise cancellation optimized to you; Magnificent Sound, engineered to perfection with the new Integrated Processor V1.',
    price: 29990,
    originalPrice: 34990,
    category: 'Electronics',
    stock: 30,
    imageUrl: 'https://picsum.photos/seed/sonywh5/600/600',
    rating: 4.7,
    reviews: 3100,
    isDeal: true,
    brand: 'Sony',
    features: ['30-hour Battery', 'Multipoint Connection', 'Touch Controls', 'Crystal Clear Calls']
  },
  {
    id: 'amz-kettle',
    name: 'Pigeon Amaze Plus Electric Kettle (1.5L)',
    description: 'Classic Design: The classical mirror polish of the appearance makes your electric kettle unique and aesthetic, which can match any type of kitchen design.',
    price: 649,
    originalPrice: 1245,
    category: 'Home & Kitchen',
    stock: 500,
    imageUrl: 'https://picsum.photos/seed/kettle/600/600',
    rating: 4.2,
    reviews: 145000,
    isDeal: true,
    isBestSeller: true,
    brand: 'Pigeon',
    features: ['1500 Watts', 'Stainless Steel Body', 'Auto Shut-off', '360 Swivel Base']
  },
  {
    id: 'amz-macm2',
    name: 'MacBook Air Laptop (M2 chip, 13.6-inch)',
    description: 'STRIKINGLY THIN DESIGN — The redesigned MacBook Air is more portable than ever and weighs just 1.24 kg. It’s the ultra-capable laptop that lets you work, play or create just about anything — anywhere.',
    price: 94900,
    originalPrice: 114900,
    category: 'Electronics',
    stock: 25,
    imageUrl: 'https://picsum.photos/seed/macm2/600/600',
    rating: 4.8,
    reviews: 1200,
    isDeal: false,
    isBestSeller: false,
    brand: 'Apple',
    features: ['8-core CPU', 'Up to 18h Battery', 'Liquid Retina Display', 'MagSafe Charging']
  },
  {
    id: 'amz-shoes',
    name: 'Adidas Men\'s Response Runner Shoes',
    description: 'Keep the pace in these men\'s Adidas running shoes. They feature a full-length Response Foam midsole for energized cushioning.',
    price: 3599,
    originalPrice: 4599,
    category: 'Fashion',
    stock: 120,
    imageUrl: 'https://picsum.photos/seed/adidas/600/600',
    rating: 4.3,
    reviews: 890,
    isDeal: true,
    brand: 'Adidas',
    features: ['Breathable Mesh', 'Durable Outsole', 'Lightweight', 'Engineered Fit']
  },
  {
    id: 'amz-book1',
    name: 'Atomic Habits by James Clear',
    description: 'The instant New York Times bestseller. A revolutionary system to get 1% better every day. People think when you want to change your life, you need to think big.',
    price: 499,
    originalPrice: 799,
    category: 'Books',
    stock: 1000,
    imageUrl: 'https://picsum.photos/seed/atomichabits/600/600',
    rating: 4.9,
    reviews: 95000,
    isDeal: false,
    isBestSeller: true,
    brand: 'Penguin',
    features: ['Hardcover', 'Self-help', 'Practical Strategies', 'Best-selling']
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-AMZ-001',
    customerName: 'Rithish M',
    customerEmail: 'm.rithish1882007@gmail.com',
    items: [{ productId: 'amz-ip15', quantity: 1, price: 71200 }],
    totalAmount: 71200,
    status: 'Processing',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ORD-AMZ-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    items: [{ productId: 'amz-sony-wh', quantity: 1, price: 29990 }],
    totalAmount: 29990,
    status: 'Shipped',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];
