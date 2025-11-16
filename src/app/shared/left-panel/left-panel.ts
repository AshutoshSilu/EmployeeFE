import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FoodCategory } from '../../models/food.model';

@Component({
  selector: 'app-left-panel',
  imports: [CommonModule],
  templateUrl: './left-panel.html',
  styleUrl: './left-panel.scss',
})
export class LeftPanelComponent {
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

  constructor(private router: Router) {}

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
}