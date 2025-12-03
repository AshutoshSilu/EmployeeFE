import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customer-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-header.html',
  styleUrls: ['./customer-header.scss']
})
export class CustomerHeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoggedIn = computed(() => this.authService.isLoggedIn());
  currentUser = computed(() => this.authService.currentUser());

  logout() {
    this.authService.logout();
    this.router.navigate(['/'], { replaceUrl: true });
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToProfile() {
    this.router.navigate(['/customer/profile']);
  }

  navigateToOrders() {
    this.router.navigate(['/customer/orders']);
  }
}