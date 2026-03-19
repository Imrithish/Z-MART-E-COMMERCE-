
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
    id: 'prod-1',
    name: 'Z-Phonic Max Wireless Headphones',
    description: 'Experience pure audio bliss with active noise cancellation and 40-hour battery life. Engineered for audiophiles who demand precision and comfort during long listening sessions.',
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
    id: 'prod-2',
    name: 'UltraVision 4K Pro Monitor',
    description: 'A 32-inch 4K IPS display with 144Hz refresh rate. Perfect for creators and gamers who need color accuracy and speed. Includes ultra-thin bezels for an immersive experience.',
    price: 45000,
    originalPrice: 52000,
    category: 'Electronics',
    stock: 15,
    imageUrl: 'https://picsum.photos/seed/monitor/600/600',
    rating: 4.8,
    reviews: 840,
    isDeal: false,
    isBestSeller: true,
    brand: 'Visionary',
    features: ['4K Resolution', '144Hz Refresh Rate', 'HDR600', 'Type-C Power Delivery']
  },
  {
    id: 'prod-3',
    name: 'Titan-Watch S3 Smartwatch',
    description: 'The ultimate fitness companion with GPS, heart rate monitoring, and a stunning AMOLED display. Track your sleep, steps, and sports activities with ease.',
    price: 12999,
    originalPrice: 15999,
    category: 'Watches',
    stock: 40,
    imageUrl: 'https://picsum.photos/seed/watch/600/600',
    rating: 4.7,
    reviews: 2100,
    isDeal: true,
    brand: 'Titan',
    features: ['AMOLED Display', 'GPS Tracking', 'Waterproof IP68', '14-Day Battery']
  },
  {
    id: 'prod-13',
    name: 'Zenith-Pro Ultrabook 14',
    description: 'Lightweight, powerful, and beautiful. The Zenith-Pro features an M2 chip and a 14-inch Liquid Retina display for peak performance anywhere.',
    price: 115000,
    originalPrice: 125000,
    category: 'Laptops',
    stock: 8,
    imageUrl: 'https://picsum.photos/seed/laptop/600/600',
    rating: 4.9,
    reviews: 320,
    isDeal: false,
    isBestSeller: true,
    brand: 'Z-MART',
    features: ['M2 Chip', '16GB RAM', '512GB SSD', 'Touch ID']
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
  {
    id: 'prod-6',
    name: 'Kitchen-Master Pro Blender',
    description: 'Professional-grade blending for smoothies, soups, and more. 2000W motor for effortless performance and commercial-grade durability.',
    price: 8999,
    originalPrice: 10999,
    category: 'Appliances',
    stock: 30,
    imageUrl: 'https://picsum.photos/seed/blender/600/600',
    rating: 4.8,
    reviews: 3200,
    isDeal: false,
    isBestSeller: true,
    brand: 'KitchenMaster',
    features: ['2000W Motor', 'BPA Free Jars', '6 Preset Functions', 'Self-Cleaning Mode']
  },
  {
    id: 'prod-15',
    name: 'Radiance Vitamin C Serum',
    description: 'Brighten and revitalize your skin with our concentrated Vitamin C formula. Organic ingredients ensure a natural glow for all skin types.',
    price: 1499,
    originalPrice: 1999,
    category: 'Skincare',
    stock: 120,
    imageUrl: 'https://picsum.photos/seed/serum/600/600',
    rating: 4.6,
    reviews: 450,
    isDeal: true,
    brand: 'Radiance',
    features: ['20% Vitamin C', 'Hyaluronic Acid', 'Paraben Free', 'Vegan Formula']
  },
  {
    id: 'prod-16',
    name: 'Ergo-Comfort Office Chair',
    description: 'Full ergonomic support for your spine. Breathable mesh back and adjustable lumbar support for long hours of productivity.',
    price: 18500,
    originalPrice: 22000,
    category: 'Furniture',
    stock: 15,
    imageUrl: 'https://picsum.photos/seed/chair/600/600',
    rating: 4.7,
    reviews: 890,
    isDeal: false,
    brand: 'ErgoHome',
    features: ['3D Armrests', 'Tilt Mechanism', 'Gas Lift Level 4', 'Silent PU Wheels']
  },
  {
    id: 'prod-11',
    name: 'Peak-Backpack Urban Nomad',
    description: 'Weather-resistant, spacious, and ergonomically designed for commuters and travelers. Includes a dedicated laptop compartment.',
    price: 4999,
    originalPrice: 5999,
    category: 'Accessories',
    stock: 80,
    imageUrl: 'https://picsum.photos/seed/backpack/600/600',
    rating: 4.6,
    reviews: 2300,
    isDeal: true,
    brand: 'PeakDesign',
    features: ['Waterproof Fabric', 'Laptop Sleeve', 'Hidden Pockets', 'Breathable Back']
  },
  {
    id: 'prod-10',
    name: 'Quest-VR Pro Headset',
    description: 'Next-level virtual reality with high-resolution displays and precise motion tracking. Dive into the metaverse with total freedom.',
    price: 34999,
    originalPrice: 39999,
    category: 'Gaming',
    stock: 12,
    imageUrl: 'https://picsum.photos/seed/vr/600/600',
    rating: 4.8,
    reviews: 670,
    isDeal: false,
    isBestSeller: true,
    brand: 'Quest',
    features: ['2K Per Eye', 'Inside-Out Tracking', 'Spatial Audio', 'Lightweight Design']
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Demo User',
    customerEmail: 'demo@example.com',
    items: [{ productId: 'prod-1', quantity: 1, price: 24999 }],
    totalAmount: 24999,
    status: 'Processing',
    createdAt: new Date().toISOString(),
  }
];
