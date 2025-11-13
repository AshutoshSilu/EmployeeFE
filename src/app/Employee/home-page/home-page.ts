import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header';
import { FooterComponent } from '../../shared/footer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home-page',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePageComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  isLoggedIn = computed(() => this.authService.isLoggedIn());
  showLoginPopup = signal(false);

  navigateToLogin() {
    this.showLoginPopup.set(true);
  }

  navigateToRegistration() {
    this.router.navigate(['/registration']);
  }

  navigateToEmployeePortal() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/employee']);
    }
  }
  
  closeLoginPopup() {
    this.showLoginPopup.set(false);
  }

  navigateToOrderNow() {
    this.router.navigate(['/order-now']);
  }
}
