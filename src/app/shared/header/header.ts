import { Component, HostListener, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginPopupComponent } from '../login-popup/login-popup';
import { ContactUsComponent } from '../ContactUS/contactus';
import { FoodCategory } from '../../models/food.model';
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
  activeDropdown = '';

  isLoggedIn = computed(() => this.authService.isLoggedIn());
  currentUser = computed(() => this.authService.currentUser());
  isCustomerDashboard = computed(() => this.router.url === '/customer');

  foodCategories = signal<FoodCategory[]>([
    {
      id: 'appetizers',
      name: 'Appetizers',
      icon: '🥗',
      isExpanded: false,
      subcategories: [
        { id: 'salads', name: 'Salads', route: '/menu/appetizers/salads' },
        { id: 'soups', name: 'Soups', route: '/menu/appetizers/soups' },
        { id: 'starters', name: 'Starters', route: '/menu/appetizers/starters' }
      ]
    },
    {
      id: 'main-course',
      name: 'Main Course',
      icon: '🍽️',
      isExpanded: false,
      subcategories: [
        { id: 'rice', name: 'Rice Dishes', route: '/menu/main-course/rice' },
        { id: 'curry', name: 'Curries', route: '/menu/main-course/curry' },
        { id: 'biryani', name: 'Biryani', route: '/menu/main-course/biryani' },
        { id: 'dal', name: 'Dal & Lentils', route: '/menu/main-course/dal' }
      ]
    },
    {
      id: 'breads',
      name: 'Breads',
      icon: '🥖',
      isExpanded: false,
      subcategories: [
        { id: 'roti', name: 'Roti', route: '/menu/breads/roti' },
        { id: 'naan', name: 'Naan', route: '/menu/breads/naan' },
        { id: 'paratha', name: 'Paratha', route: '/menu/breads/paratha' }
      ]
    },
    {
      id: 'desserts',
      name: 'Desserts',
      icon: '🍰',
      isExpanded: false,
      subcategories: [
        { id: 'sweets', name: 'Traditional Sweets', route: '/menu/desserts/sweets' },
        { id: 'ice-cream', name: 'Ice Cream', route: '/menu/desserts/ice-cream' },
        { id: 'cakes', name: 'Cakes', route: '/menu/desserts/cakes' }
      ]
    },
    {
      id: 'beverages',
      name: 'Beverages',
      icon: '🥤',
      isExpanded: false,
      subcategories: [
        { id: 'hot', name: 'Hot Drinks', route: '/menu/beverages/hot' },
        { id: 'cold', name: 'Cold Drinks', route: '/menu/beverages/cold' },
        { id: 'juices', name: 'Fresh Juices', route: '/menu/beverages/juices' }
      ]
    }
  ]);

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

  toggleCategory(categoryId: string) {
    this.foodCategories.update(categories =>
      categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, isExpanded: !cat.isExpanded }
          : { ...cat, isExpanded: false }
      )
    );
  }

  navigateToSubcategory(route: string) {
    this.router.navigate([route]);
  }

  showDropdown(menu: string) {
    this.activeDropdown = menu;
  }

  hideDropdown(menu: string) {
    setTimeout(() => {
      if (this.activeDropdown === menu) {
        this.activeDropdown = '';
      }
    }, 200);
  }
}