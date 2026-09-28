export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  itemsCount: number;
  items: OrderItem[];
  shippingAddress: string;
  createdAt: string;
}
