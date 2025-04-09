export interface Product {
  name: string;
  specs: string;
  status: 'Delivered' | 'Pending' | 'Cancelled';
  qty: number;
  price: number;
  deliveredOn?: string;
  estimatedDelivery?: string;
  cancelReason?: string;
}

export interface Order {
  id: string;
  date: string;
  customer: string;
  product: string;
  total: number;
  status: 'Delivered' | 'Pending' | 'Cancelled';
  paymentMethod: 'Credit Card' | 'PayPal';
  products: Product[];
}

export const orders: Order[] = [
  {
    id: '#ORD-7829',
    date: '2025-04-03',
    customer: 'John Smith',
    product: 'MacBook Pro 13″',
    total: 1299,
    status: 'Delivered',
    paymentMethod: 'Credit Card',
    products: [
      {
        name: 'MacBook Pro 13″',
        specs: 'Apple M2, 16GB RAM, 512GB SSD',
        status: 'Delivered',
        qty: 1,
        price: 1299,
        deliveredOn: '2025-04-04',
      },
    ],
  },
  {
    id: '#ORD-7830',
    date: '2025-04-03',
    customer: 'Emma Johnson',
    product: 'Apple Watch Ultra',
    total: 799,
    status: 'Pending',
    paymentMethod: 'PayPal',
    products: [
      {
        name: 'Apple Watch Ultra',
        specs: 'Titanium Case, Alpine Loop',
        status: 'Pending',
        qty: 1,
        price: 799,
        estimatedDelivery: '2025-04-10',
      },
    ],
  },
  {
    id: '#ORD-7831',
    date: '2025-04-02',
    customer: 'Michael Brown',
    product: 'iPhone 15 Pro Max',
    total: 1199,
    status: 'Delivered',
    paymentMethod: 'Credit Card',
    products: [
      {
        name: 'iPhone 15 Pro Max',
        specs: '256GB, Space Black',
        status: 'Delivered',
        qty: 1,
        price: 1199,
        deliveredOn: '2025-04-03',
      },
    ],
  },
  {
    id: '#ORD-7832',
    date: '2025-04-04',
    customer: 'Sophia Lee',
    product: 'iPad Pro 11″',
    total: 899,
    status: 'Pending',
    paymentMethod: 'Credit Card',
    products: [
      {
        name: 'iPad Pro 11″',
        specs: 'M2, 128GB, Wi-Fi',
        status: 'Pending',
        qty: 1,
        price: 899,
        estimatedDelivery: '2025-04-11',
      },
    ],
  },
  {
    id: '#ORD-7833',
    date: '2025-04-04',
    customer: 'David Wilson',
    product: 'AirPods Max',
    total: 549,
    status: 'Cancelled',
    paymentMethod: 'PayPal',
    products: [
      {
        name: 'AirPods Max',
        specs: 'Space Gray',
        status: 'Cancelled',
        qty: 1,
        price: 549,
        cancelReason: 'Payment declined',
      },
    ],
  },
  {
    id: '#ORD-7833',
    date: '2025-04-04',
    customer: 'David Wilson',
    product: 'AirPods Max',
    total: 549,
    status: 'Cancelled',
    paymentMethod: 'PayPal',
    products: [
      {
        name: 'AirPods Max',
        specs: 'Space Gray',
        status: 'Cancelled',
        qty: 1,
        price: 549,
        cancelReason: 'Payment declined',
      },
    ],
  },
  {
    id: '#ORD-7833',
    date: '2025-04-04',
    customer: 'David Wilson',
    product: 'AirPods Max',
    total: 549,
    status: 'Cancelled',
    paymentMethod: 'PayPal',
    products: [
      {
        name: 'AirPods Max',
        specs: 'Space Gray',
        status: 'Cancelled',
        qty: 1,
        price: 549,
        cancelReason: 'Payment declined',
      },
    ],
  },
  {
    id: '#ORD-7833',
    date: '2025-04-04',
    customer: 'David Wilson',
    product: 'AirPods Max',
    total: 549,
    status: 'Cancelled',
    paymentMethod: 'PayPal',
    products: [
      {
        name: 'AirPods Max',
        specs: 'Space Gray',
        status: 'Cancelled',
        qty: 1,
        price: 549,
        cancelReason: 'Payment declined',
      },
    ],
  },
  {
    id: '#ORD-7833',
    date: '2025-04-04',
    customer: 'David Wilson',
    product: 'AirPods Max',
    total: 549,
    status: 'Cancelled',
    paymentMethod: 'PayPal',
    products: [
      {
        name: 'AirPods Max',
        specs: 'Space Gray',
        status: 'Cancelled',
        qty: 1,
        price: 549,
        cancelReason: 'Payment declined',
      },
    ],
  },
  {
    id: '#ORD-7833',
    date: '2025-04-04',
    customer: 'David Wilson',
    product: 'AirPods Max',
    total: 549,
    status: 'Cancelled',
    paymentMethod: 'PayPal',
    products: [
      {
        name: 'AirPods Max',
        specs: 'Space Gray',
        status: 'Cancelled',
        qty: 1,
        price: 549,
        cancelReason: 'Payment declined',
      },
    ],
  },
  {
    id: '#ORD-7833',
    date: '2025-04-04',
    customer: 'David Wilson',
    product: 'AirPods Max',
    total: 549,
    status: 'Cancelled',
    paymentMethod: 'PayPal',
    products: [
      {
        name: 'AirPods Max',
        specs: 'Space Gray',
        status: 'Cancelled',
        qty: 1,
        price: 549,
        cancelReason: 'Payment declined',
      },
    ],

  },
  {
    id: '#ORD-7833',
    date: '2025-04-04',
    customer: 'David Wilson',
    product: 'AirPods Max',
    total: 549,
    status: 'Cancelled',
    paymentMethod: 'PayPal',
    products: [
      {
        name: 'AirPods Max',
        specs: 'Space Gray',
        status: 'Cancelled',
        qty: 1,
        price: 549,
        cancelReason: 'Payment declined',
      },
    ],
  },
  
];
