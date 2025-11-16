import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser = computed(() => this.authService.currentUser());
  isLoggedIn = computed(() => this.authService.isLoggedIn());

  logout() {
    this.authService.logout();
    this.router.navigate(['/'], { replaceUrl: true });
  }

  navigateToEmployee() {
    this.router.navigate(['/employee']);
  }
}