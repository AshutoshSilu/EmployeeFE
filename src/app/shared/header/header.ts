import { Component, HostListener, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginPopupComponent } from '../login-popup/login-popup';
import { ContactUsComponent } from '../ContactUS/contactus';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LoginPopupComponent, ContactUsComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.scss', './contact-popup.scss']
})
export class HeaderComponent {
  home() {
    this.router.navigateByUrl('/');
  }
  private router = inject(Router);
  private authService = inject(AuthService);

  isMenuOpen = signal(false);
  showMenuDropdown = signal(false);
  showLoginPopup = signal(false);
  showContactPopup = signal(false);

  isLoggedIn = computed(() => this.authService.isLoggedIn());
  currentUser = computed(() => this.authService.currentUser());

  logout() {
    this.authService.logout();
    this.router.navigate(['/'], { replaceUrl: true });
  }

  toggleMenu() {
    this.isMenuOpen.update(open => !open);
    this.showMenuDropdown.update(show => !show);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const menuContainer = target.closest('.menu-container');
    if (!menuContainer && this.showMenuDropdown()) {
      this.showMenuDropdown.set(false);
      this.isMenuOpen.set(false);
    }
  }

  navigateToLogin() {
    this.showLoginPopup.set(true);
  }

  closeLoginPopup() {
    this.showLoginPopup.set(false);
  }

  openContactPopup() {
    this.showContactPopup.set(true);
  }

  closeContactPopup() {
    this.showContactPopup.set(false);
  }

  navigateToRegistration() {
    this.router.navigate(['/registration']);
  }

  navigateToEmployee() {
    this.router.navigate(['/employee']);
    this.isMenuOpen.set(false);
  }

  navigateToEmployeePortal(event: Event) {
    event.preventDefault();
    if (this.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/employee']);
    }
  }

  scrollToContact(event: Event) {
    event.preventDefault();
    this.openContactPopup();
  }

  navigateToOrderNow(event: Event) {
    event.preventDefault();
    this.router.navigate(['/order-now']);
  }

  navigateToOffers(event: Event) {
    event.preventDefault();
    this.router.navigate(['/offers']);
  }

  navigateToTrackOrder(event: Event) {
    event.preventDefault();
    this.router.navigate(['/track-order']);
  }

  navigateToCustomerDashboard(event: Event) {
    event.preventDefault();
    this.router.navigate(['/customer']);
  }
}