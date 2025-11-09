import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  isMenuOpen = false;
  showMenuDropdown = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.showMenuDropdown = !this.showMenuDropdown;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const menuContainer = target.closest('.menu-container');
    if (!menuContainer && this.showMenuDropdown) {
      this.showMenuDropdown = false;
      this.isMenuOpen = false;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegistration() {
    this.router.navigate(['/registration']);
  }

  navigateToEmployee() {
    this.router.navigate(['/employee']);
    this.isMenuOpen = false;
  }
}