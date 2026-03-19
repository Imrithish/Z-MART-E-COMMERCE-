export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
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
    name: 'Premium Wireless Headphones',
    description: 'Experience crystal clear sound with our latest noise-cancelling technology.',
    price: 199.99,
    category: 'Electronics',
    stock: 45,
    imageUrl: 'https://picsum.photos/seed/zmart2/600/600',
  },
  {
    id: '2',
    name: 'Smart Home Hub',
    description: 'The central brain for all your smart home devices. Control everything with ease.',
    price: 129.50,
    category: 'Home Automation',
    stock: 20,
    imageUrl: 'https://picsum.photos/seed/zmart3/600/600',
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair',
    description: 'Designed for comfort and productivity. Fully adjustable to suit your needs.',
    price: 249.00,
    category: 'Furniture',
    stock: 12,
    imageUrl: 'https://picsum.photos/seed/zmart4/600/600',
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    description: 'A responsive and tactile typing experience for professionals and gamers alike.',
    price: 89.99,
    category: 'Computing',
    stock: 60,
    imageUrl: 'https://picsum.photos/seed/zmart5/600/600',
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    items: [{ productId: '1', quantity: 1, price: 199.99 }],
    totalAmount: 199.99,
    status: 'Processing',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    items: [{ productId: '2', quantity: 1, price: 129.50 }],
    totalAmount: 129.50,
    status: 'Shipped',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];