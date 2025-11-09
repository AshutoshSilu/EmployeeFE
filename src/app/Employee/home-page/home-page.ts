import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header';
import { FooterComponent } from '../../shared/footer';

@Component({
  selector: 'app-home-page',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePageComponent {
  private router = inject(Router);

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegistration() {
    this.router.navigate(['/registration']);
  }

  navigateToEmployeePortal() {
    this.router.navigate(['/employee-portal']);
  }
}
