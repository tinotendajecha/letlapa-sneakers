// Define Product type locally if './store' is missing
import { Product } from "./store";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  date: string;
  trackingNumber?: string;
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  items: {
    productId: string;
    productName: string;
    productImage: string;
    brand: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }[];
}


export const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Air Jordan 1 Retro High OG',
    brand: 'Jordan',
    price: 2899,
    originalPrice: 3299,
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'],
    colors: ['Black/Red', 'White/Black'],
    category: 'Basketball',
    description: 'The iconic Air Jordan 1 that started it all. Premium leather construction with classic colorway.',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 324,
  },
  {
    _id: '2',
    name: 'Nike Air Max 90',
    brand: 'Nike',
    price: 2199,
    images: [
      'https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'],
    colors: ['White/Grey', 'Black/White', 'Navy/White'],
    category: 'Lifestyle',
    description: 'The Air Max 90 stays true to its OG running roots with iconic Waffle outsole.',
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 189,
  },
  {
    _id: '3',
    name: 'Adidas Yeezy Boost 350 V2',
    brand: 'Adidas',
    price: 4299,
    images: [
      'https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5'],
    colors: ['Zebra', 'Cream White', 'Static'],
    category: 'Lifestyle',
    description: 'Kanye West\'s revolutionary design meets adidas innovation in this sought-after silhouette.',
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 567,
  },
  {
    _id: '4',
    name: 'Converse Chuck Taylor All Star',
    brand: 'Converse',
    price: 1299,
    images: [
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'White', 'Red', 'Navy'],
    category: 'Casual',
    description: 'The timeless classic that has been a cultural icon for decades.',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 892,
  },
  {
    _id: '5',
    name: 'Puma RS-X',
    brand: 'Puma',
    price: 1899,
    images: [
      'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10'],
    colors: ['Multi', 'Black/White', 'Red/Blue'],
    category: 'Running',
    description: 'Bold, chunky design with retro-futuristic aesthetics and superior comfort.',
    inStock: false,
    featured: false,
    rating: 4.3,
    reviews: 156,
  },
  {
    _id: '6',
    name: 'Vans Old Skool',
    brand: 'Vans',
    price: 1599,
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black/White', 'Navy/White', 'Checkerboard'],
    category: 'Skate',
    description: 'The classic skate shoe with the iconic sidestripe, built for durability and style.',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 445,
  },
];

export const provinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

export const mockReviews = [
  {
    id: '1',
    productId: '1',
    user: 'Thabo M.',
    rating: 5,
    comment: 'Amazing quality! Exactly as described. Fast delivery to Cape Town.',
    date: '2024-01-15',
    verified: true,
  },
  {
    id: '2',
    productId: '1',
    user: 'Sarah L.',
    rating: 4,
    comment: 'Great sneakers, comfortable fit. The authentication guarantee gave me confidence to buy.',
    date: '2024-01-10',
    verified: true,
  },
  {
    id: '3',
    productId: '2',
    user: 'Michael K.',
    rating: 5,
    comment: 'Perfect condition, fast shipping to Durban. Will definitely order again from Letlapa!',
    date: '2024-01-08',
    verified: true,
  },
];


export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'cust-1',
    customerName: 'Thabo Mthembu',
    customerEmail: 'thabo.m@email.com',
    status: 'delivered',
    total: 2899,
    date: '2024-01-15',
    trackingNumber: 'TRK123456789',
    shippingAddress: {
      street: '123 Long Street',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
    },
    items: [
      {
        productId: '1',
        productName: 'Air Jordan 1 Retro High OG',
        productImage: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
        brand: 'Jordan',
        size: '9',
        color: 'Black/Red',
        quantity: 1,
        price: 2899,
      },
    ],
  },
  {
    id: 'ORD-002',
    customerId: 'cust-2',
    customerName: 'Sarah Lebese',
    customerEmail: 'sarah.l@email.com',
    status: 'shipped',
    total: 4498,
    date: '2024-01-18',
    trackingNumber: 'TRK987654321',
    shippingAddress: {
      street: '456 Market Street',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2001',
    },
    items: [
      {
        productId: '2',
        productName: 'Nike Air Max 90',
        productImage: 'https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=400',
        brand: 'Nike',
        size: '8',
        color: 'White/Grey',
        quantity: 1,
        price: 2199,
      },
      {
        productId: '1',
        productName: 'Air Jordan 1 Retro High OG',
        productImage: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
        brand: 'Jordan',
        size: '8.5',
        color: 'White/Black',
        quantity: 1,
        price: 2299,
      },
    ],
  },
  {
    id: 'ORD-003',
    customerId: 'cust-3',
    customerName: 'Michael Khumalo',
    customerEmail: 'michael.k@email.com',
    status: 'processing',
    total: 4299,
    date: '2024-01-20',
    shippingAddress: {
      street: '789 Church Street',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4001',
    },
    items: [
      {
        productId: '3',
        productName: 'Adidas Yeezy Boost 350 V2',
        productImage: 'https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=400',
        brand: 'Adidas',
        size: '9.5',
        color: 'Zebra',
        quantity: 1,
        price: 4299,
      },
    ],
  },
  {
    id: 'ORD-004',
    customerId: 'cust-4',
    customerName: 'Nomsa Pillay',
    customerEmail: 'nomsa.p@email.com',
    status: 'paid',
    total: 2898,
    date: '2024-01-22',
    shippingAddress: {
      street: '321 Main Road',
      city: 'Port Elizabeth',
      province: 'Eastern Cape',
      postalCode: '6001',
    },
    items: [
      {
        productId: '4',
        productName: 'Converse Chuck Taylor All Star',
        productImage: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
        brand: 'Converse',
        size: '7',
        color: 'Black',
        quantity: 1,
        price: 1299,
      },
      {
        productId: '6',
        productName: 'Vans Old Skool',
        productImage: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
        brand: 'Vans',
        size: '7',
        color: 'Black/White',
        quantity: 1,
        price: 1599,
      },
    ],
  },
  {
    id: 'ORD-005',
    customerId: 'cust-5',
    customerName: 'David van der Merwe',
    customerEmail: 'david.v@email.com',
    status: 'cancelled',
    total: 1899,
    date: '2024-01-12',
    shippingAddress: {
      street: '654 Oak Avenue',
      city: 'Pretoria',
      province: 'Gauteng',
      postalCode: '0001',
    },
    items: [
      {
        productId: '5',
        productName: 'Puma RS-X',
        productImage: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=400',
        brand: 'Puma',
        size: '10',
        color: 'Multi',
        quantity: 1,
        price: 1899,
      },
    ],
  },
];