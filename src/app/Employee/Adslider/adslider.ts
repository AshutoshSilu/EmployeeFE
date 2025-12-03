import { Component, signal, OnInit, OnDestroy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-adslider',
  imports: [CommonModule],
  templateUrl: './adslider.html',
  styleUrl: './adslider.scss',
})
export class Adslider implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  currentSlide = signal(0);
  private intervalId: any;
  
  isLoggedIn = computed(() => this.authService.isLoggedIn());

  ads = [
    {
      title: '🍕 Fresh Pizza Special',
      description: 'Handcrafted pizzas with premium ingredients. Order now and get 20% off!',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop',
      offer: '20% OFF'
    },
    {
      title: '🍔 Gourmet Burgers',
      description: 'Juicy burgers made with fresh ingredients. Free delivery on orders above $25!',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop',
      offer: 'FREE DELIVERY'
    },
    {
      title: '🍜 Healthy Bowls',
      description: 'Nutritious and delicious bowls packed with fresh vegetables and proteins.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop',
      offer: 'NEW MENU'
    }
  ];

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  nextSlide() {
    this.currentSlide.update(current => 
      current === this.ads.length - 1 ? 0 : current + 1
    );
  }

  prevSlide() {
    this.currentSlide.update(current => 
      current === 0 ? this.ads.length - 1 : current - 1
    );
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
  }

  navigateToOrder() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/order-now']);
    } else {
      this.router.navigate(['/registration']);
    }
  }
}
