import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  
  menuItems = signal<MenuItem[]>([]);
  showAddForm = signal(false);
  
  addMenuForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    url: ['', Validators.required],
    icon: ['', Validators.required]
  });

  ngOnInit() {
    this.loadMenuItems();
  }

  loadMenuItems() {
    // Mock data - replace with actual API call
    const mockItems: MenuItem[] = [
      { id: 1, name: 'Dashboard', url: '/dashboard', icon: '📊' },
      { id: 2, name: 'Employees', url: '/employee', icon: '👥' },
      { id: 3, name: 'Reports', url: '/reports', icon: '📈' }
    ];
    this.menuItems.set(mockItems);
  }

  toggleAddForm() {
    this.showAddForm.set(!this.showAddForm());
  }

  addMenuItem() {
    if (this.addMenuForm.valid) {
      const newItem: MenuItem = {
        id: Date.now(),
        ...this.addMenuForm.value
      };
      
      this.menuItems.set([...this.menuItems(), newItem]);
      this.addMenuForm.reset();
      this.showAddForm.set(false);
    }
  }

  deleteMenuItem(id: number) {
    this.menuItems.set(this.menuItems().filter(item => item.id !== id));
  }
}