import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header';
import { FooterComponent } from '../../shared/footer';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class CheckoutComponent implements OnInit {
  orderItems: OrderItem[] = [];
  orderTotal: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    // Get cart items from navigation state or service
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.orderItems = navigation.extras.state['cartItems'] || [];
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.orderTotal = this.orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Use reverse geocoding to get address
          this.reverseGeocode(lat, lng);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get current location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  reverseGeocode(lat: number, lng: number) {
    // Simple implementation - in real app, use Google Maps API or similar
    const locationInput = document.getElementById('location') as HTMLInputElement;
    if (locationInput) {
      locationInput.value = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    }
  }

  placeOrder() {
    const name = (document.getElementById('name') as HTMLInputElement)?.value;
    const address = (document.getElementById('address') as HTMLTextAreaElement)?.value;
    const pincode = (document.getElementById('pincode') as HTMLInputElement)?.value;
    const location = (document.getElementById('location') as HTMLInputElement)?.value;

    if (!name || !address || !pincode || !location) {
      alert('Please fill all required fields');
      return;
    }

    const orderData = {
      items: this.orderItems,
      total: this.orderTotal,
      deliveryAddress: {
        name,
        address,
        pincode,
        location
      }
    };

    console.log('Order placed:', orderData);
    alert('Order placed successfully!');
    this.router.navigate(['/']);
  }
}