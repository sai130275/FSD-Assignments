export interface OrderItem {
  menuItemId: string;
  quantity: number;
}

export interface PlaceOrderRequest {
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  specialInstructions?: string;
  deliveryType: 'dine-in' | 'takeaway';
}

export interface OrderResponse {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
}
