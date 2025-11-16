export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem extends Dish {
  quantity: number;
}