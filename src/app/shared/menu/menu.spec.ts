import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { MenuComponent } from './menu';
import 'zone.js';
import 'zone.js/testing';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        provideZoneChangeDetection({ eventCoalescing: true })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load menu items on init', () => {
    component.ngOnInit();
    expect(component.menuItems().length).toBe(3);
    expect(component.menuItems()[0].name).toBe('Dashboard');
  });

  it('should toggle add form', () => {
    expect(component.showAddForm()).toBe(false);
    component.toggleAddForm();
    expect(component.showAddForm()).toBe(true);
  });

  it('should add menu item when form is valid', () => {
    component.addMenuForm.patchValue({
      name: 'Test Menu',
      url: '/test',
      icon: '🧪'
    });
    
    const initialCount = component.menuItems().length;
    component.addMenuItem();
    
    expect(component.menuItems().length).toBe(initialCount + 1);
    expect(component.showAddForm()).toBe(false);
  });

  it('should delete menu item', () => {
    component.ngOnInit();
    const initialCount = component.menuItems().length;
    const firstItemId = component.menuItems()[0].id;
    
    component.deleteMenuItem(firstItemId);
    
    expect(component.menuItems().length).toBe(initialCount - 1);
  });

  it('should not add menu item when form is invalid', () => {
    const initialCount = component.menuItems().length;
    component.addMenuItem();
    expect(component.menuItems().length).toBe(initialCount);
  });
});