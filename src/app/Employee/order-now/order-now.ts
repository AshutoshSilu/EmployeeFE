import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface CartItem extends Dish {
  quantity: number;
}

@Component({
  selector: 'app-order-now',
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './order-now.html',
  styleUrl: './order-now.scss',
})
export class OrderNowComponent {
  private cart = signal<CartItem[]>([]);
  
  constructor(private router: Router) {}
  
  cartItems = computed(() => this.cart());

  dishes: Dish[] = [
    {
      id: 1,
      name: 'Butter Chicken',
      description: 'Creamy tomato-based curry with tender chicken pieces',
      price: 280,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Biryani',
      description: 'Aromatic basmati rice with spiced meat and vegetables',
      price: 320,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Dal Tadka',
      description: 'Yellow lentils tempered with cumin and spices',
      price: 180,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Paneer Tikka',
      description: 'Grilled cottage cheese marinated in spices',
      price: 240,
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Masala Dosa',
      description: 'Crispy crepe filled with spiced potato curry',
      price: 120,
      image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      name: 'Chole Bhature',
      description: 'Spicy chickpea curry with fried bread',
      price: 160,
      image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop'
    }
  ];

  addToCart(dish: Dish) {
    const currentCart = this.cart();
    const existingItem = currentCart.find(item => item.id === dish.id);
    
    if (existingItem) {
      this.cart.set(currentCart.map(item => 
        item.id === dish.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      this.cart.set([...currentCart, { ...dish, quantity: 1 }]);
    }
  }

  increaseQuantity(dishId: number) {
    const currentCart = this.cart();
    this.cart.set(currentCart.map(item => 
      item.id === dishId 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  }

  decreaseQuantity(dishId: number) {
    const currentCart = this.cart();
    this.cart.set(currentCart.map(item => 
      item.id === dishId 
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    ).filter(item => item.quantity > 0));
  }

  getCartTotal(): number {
    return this.cartItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout'], {
      state: { 
        cartItems: this.cartItems(),
        total: this.getCartTotal()
      }
    });
  }
}