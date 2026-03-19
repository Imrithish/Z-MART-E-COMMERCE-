
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
    description: 'Experience pure audio bliss with active noise cancellation and 40-hour battery life. Engineered for audiophiles who demand precision.',
    price: 24999,
    originalPrice: 29999,
    category: 'Electronics',
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
    description: 'A 32-inch 4K IPS display with 144Hz refresh rate. Perfect for creators and gamers who need color accuracy and speed.',
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
    description: 'The ultimate fitness companion with GPS, heart rate monitoring, and a stunning AMOLED display.',
    price: 12999,
    originalPrice: 15999,
    category: 'Electronics',
    stock: 40,
    imageUrl: 'https://picsum.photos/seed/watch/600/600',
    rating: 4.7,
    reviews: 2100,
    isDeal: true,
    brand: 'Titan',
    features: ['AMOLED Display', 'GPS Tracking', 'Waterproof IP68', '14-Day Battery']
  },
  {
    id: 'prod-4',
    name: 'Aero-Drone X Explorer',
    description: 'Capture the world from above with 4K video, 3-axis stabilization, and intuitive flight controls.',
    price: 59999,
    originalPrice: 65000,
    category: 'Electronics',
    stock: 10,
    imageUrl: 'https://picsum.photos/seed/drone/600/600',
    rating: 4.6,
    reviews: 450,
    isDeal: false,
    brand: 'Aero',
    features: ['4K Camera', '30min Flight Time', 'GPS Return Home', 'Foldable Design']
  },
  {
    id: 'prod-5',
    name: 'Swift-E-Bike City Rider',
    description: 'Navigate the urban jungle with ease. Lightweight aluminum frame and a powerful 250W motor.',
    price: 85000,
    originalPrice: 95000,
    category: 'Fashion',
    stock: 5,
    imageUrl: 'https://picsum.photos/seed/ebike/600/600',
    rating: 4.5,
    reviews: 120,
    isDeal: true,
    brand: 'Swift',
    features: ['250W Motor', 'Removable Battery', 'Shimano Gears', 'Disc Brakes']
  },
  {
    id: 'prod-6',
    name: 'Kitchen-Master Pro Blender',
    description: 'Professional-grade blending for smoothies, soups, and more. 2000W motor for effortless performance.',
    price: 8999,
    originalPrice: 10999,
    category: 'Home & Kitchen',
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
    id: 'prod-7',
    name: 'Nova-Speaker Smart Home Hub',
    description: 'Crystal clear sound meets smart assistant integration. Control your entire home with your voice.',
    price: 5499,
    originalPrice: 6999,
    category: 'Electronics',
    stock: 100,
    imageUrl: 'https://picsum.photos/seed/speaker/600/600',
    rating: 4.4,
    reviews: 15400,
    isDeal: true,
    brand: 'Nova',
    features: ['Built-in Assistant', '360° Sound', 'Bluetooth 5.0', 'Privacy Mute Switch']
  },
  {
    id: 'prod-8',
    name: 'Zen-Yoga Premium Mat',
    description: 'Extra thick, eco-friendly yoga mat providing superior grip and comfort for your practice.',
    price: 2499,
    originalPrice: 3500,
    category: 'Fashion',
    stock: 200,
    imageUrl: 'https://picsum.photos/seed/yoga/600/600',
    rating: 4.9,
    reviews: 890,
    isDeal: false,
    brand: 'ZenYoga',
    features: ['Eco-Friendly TPE', 'Non-Slip Surface', '6mm Thickness', 'Carry Strap Included']
  },
  {
    id: 'prod-9',
    name: 'Lumina-Lamp Smart Ambient Light',
    description: 'Transform your space with 16 million colors and customizable light scenes controlled via app.',
    price: 3999,
    originalPrice: 4999,
    category: 'Home & Kitchen',
    stock: 60,
    imageUrl: 'https://picsum.photos/seed/lamp/600/600',
    rating: 4.7,
    reviews: 1100,
    isDeal: true,
    brand: 'Lumina',
    features: ['App Control', 'Sync with Music', 'Dimmable', 'Energy Efficient']
  },
  {
    id: 'prod-10',
    name: 'Quest-VR Pro Headset',
    description: 'Next-level virtual reality with high-resolution displays and precise motion tracking.',
    price: 34999,
    originalPrice: 39999,
    category: 'Electronics',
    stock: 12,
    imageUrl: 'https://picsum.photos/seed/vr/600/600',
    rating: 4.8,
    reviews: 670,
    isDeal: false,
    isBestSeller: true,
    brand: 'Quest',
    features: ['2K Per Eye', 'Inside-Out Tracking', 'Spatial Audio', 'Lightweight Design']
  },
  {
    id: 'prod-11',
    name: 'Peak-Backpack Urban Nomad',
    description: 'Weather-resistant, spacious, and ergonomically designed for commuters and travelers.',
    price: 4999,
    originalPrice: 5999,
    category: 'Fashion',
    stock: 80,
    imageUrl: 'https://picsum.photos/seed/backpack/600/600',
    rating: 4.6,
    reviews: 2300,
    isDeal: true,
    brand: 'PeakDesign',
    features: ['Waterproof Fabric', 'Laptop Sleeve', 'Hidden Pockets', 'Breathable Back']
  },
  {
    id: 'prod-12',
    name: 'Hydra-Flask 1L Insulated Bottle',
    description: 'Keep your drinks cold for 24 hours or hot for 12 hours with vacuum insulation technology.',
    price: 1499,
    originalPrice: 1999,
    category: 'Home & Kitchen',
    stock: 300,
    imageUrl: 'https://picsum.photos/seed/bottle/600/600',
    rating: 4.9,
    reviews: 4500,
    isDeal: false,
    brand: 'Hydra',
    features: ['Double-Wall Insulation', 'Stainless Steel', 'BPA Free', 'Leak Proof Cap']
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
