import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuService } from '../../services/menu';

interface MenuItem {
  id: number;
  name: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss']
})
export class MenuComponent implements OnInit {
  private menuService = inject(MenuService);
  private fb = inject(FormBuilder);
  
  menuItems = signal<MenuItem[]>([]);
  showAddForm = signal(false);
  
  menus = computed(() => this.menuService.menus());
  loading = computed(() => this.menuService.loading());
  error = computed(() => this.menuService.error());
  
  addMenuForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    url: ['', Validators.required],
    icon: ['', Validators.required]
  });

  ngOnInit() {
    this.loadMenuItems();
    this.menuService.getAllMenus().subscribe();
  }

  loadMenuItems() {
    // Mock data for local menu items
    const mockItems: MenuItem[] = [
      { id: 1, name: 'Dashboard', url: '/dashboard', icon: '📊' },
      { id: 2, name: 'Employees', url: '/employee', icon: '👥' },
      { id: 3, name: 'Reports', url: '/reports', icon: '📈' }
    ];
    this.menuItems.set(mockItems);
  }

  toggleAddForm() {
    this.showAddForm.update(show => !show);
  }

  addMenuItem() {
    if (this.addMenuForm.valid) {
      const newItem: MenuItem = {
        id: Date.now(),
        ...this.addMenuForm.value
      };
      
      this.menuItems.update(items => [...items, newItem]);
      this.addMenuForm.reset();
      this.showAddForm.set(false);
    }
  }

  deleteMenuItem(id: number) {
    this.menuItems.update(items => items.filter(item => item.id !== id));
  }
}