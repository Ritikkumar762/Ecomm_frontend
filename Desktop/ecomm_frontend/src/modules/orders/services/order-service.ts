import { apiClient } from '@/lib/api-client';
import { Order, OrderStatus } from '../types/order.types';

let mockOrders: Order[] = [
  {
    id: 'ord_101',
    orderNumber: 'ORD-9841',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    totalAmount: 199.99,
    status: 'delivered',
    paymentStatus: 'paid',
    itemsCount: 1,
    items: [
      {
        id: 'item_1',
        productId: 'prod_01',
        productName: 'Minimalist Wireless Headphones',
        sku: 'HEAD-BLK-01',
        quantity: 1,
        unitPrice: 199.99,
        totalPrice: 199.99,
      },
    ],
    shippingAddress: '42 Connaught Place, New Delhi, India',
    createdAt: '2026-09-27T10:30:00Z',
  },
  {
    id: 'ord_102',
    orderNumber: 'ORD-9842',
    customerName: 'Priya Patel',
    customerEmail: 'priya.patel@example.com',
    totalAmount: 228.50,
    status: 'processing',
    paymentStatus: 'paid',
    itemsCount: 2,
    items: [
      {
        id: 'item_2',
        productId: 'prod_02',
        productName: 'Ergonomic Mechanical Keyboard',
        sku: 'KEY-RED-01',
        quantity: 1,
        unitPrice: 149.50,
        totalPrice: 149.50,
      },
      {
        id: 'item_3',
        productId: 'prod_03',
        productName: 'Organic Cotton Premium Hoodie',
        sku: 'HOOD-GRY-M',
        quantity: 1,
        unitPrice: 79.00,
        totalPrice: 79.00,
      },
    ],
    shippingAddress: '15 Bandra Kurla Complex, Mumbai, India',
    createdAt: '2026-09-28T08:15:00Z',
  },
  {
    id: 'ord_103',
    orderNumber: 'ORD-9843',
    customerName: 'Rahul Verma',
    customerEmail: 'rahul.verma@example.com',
    totalAmount: 79.00,
    status: 'pending',
    paymentStatus: 'unpaid',
    itemsCount: 1,
    items: [
      {
        id: 'item_4',
        productId: 'prod_03',
        productName: 'Organic Cotton Premium Hoodie',
        sku: 'HOOD-GRY-L',
        quantity: 1,
        unitPrice: 79.00,
        totalPrice: 79.00,
      },
    ],
    shippingAddress: '77 MG Road, Bengaluru, India',
    createdAt: '2026-09-28T11:45:00Z',
  },
];

export const orderService = {
  async getOrders(): Promise<Order[]> {
    try {
      const response = await apiClient.get<Order[]>('/admin/orders');
      return response.data;
    } catch {
      return [...mockOrders];
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const response = await apiClient.patch<Order>(`/admin/orders/${orderId}`, { status });
      return response.data;
    } catch {
      const order = mockOrders.find((o) => o.id === orderId);
      if (!order) throw new Error('Order not found');
      order.status = status;
      return order;
    }
  },
};
