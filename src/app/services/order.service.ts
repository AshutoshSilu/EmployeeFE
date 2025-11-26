import { Injectable, signal } from '@angular/core';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: 'ordered' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderTime: Date;
  items: OrderItem[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private currentOrder = signal<Order | null>({
    id: 'ORD-001',
    status: 'ordered',
    orderTime: new Date(),
    items: [
      { name: 'Chicken Biryani', quantity: 2, price: 250 },
      { name: 'Paneer Curry', quantity: 1, price: 180 }
    ],
    total: 680
  });

  getCurrentOrder() {
    return this.currentOrder.asReadonly();
  }

  updateOrderStatus(status: Order['status']) {
    this.currentOrder.update(order => 
      order ? { ...order, status } : null
    );
  }

  cancelOrder() {
    this.updateOrderStatus('cancelled');
  }

  createOrder(items: OrderItem[]): Order {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      status: 'ordered',
      orderTime: new Date(),
      items,
      total
    };
    
    this.currentOrder.set(newOrder);
    return newOrder;
  }
}