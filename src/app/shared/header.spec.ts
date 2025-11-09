import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';
import { HeaderComponent } from './header';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu', () => {
    expect(component.isMenuOpen).toBe(false);
    component.toggleMenu();
    expect(component.isMenuOpen).toBe(true);
    expect(component.showMenuDropdown).toBe(true);
  });

  it('should navigate to login', () => {
    component.navigateToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to registration', () => {
    component.navigateToRegistration();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/registration']);
  });

  it('should navigate to employee portal', () => {
    component.navigateToEmployee();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employee']);
    expect(component.isMenuOpen).toBe(false);
  });

  it('should close menu on outside click', () => {
    component.showMenuDropdown = true;
    component.isMenuOpen = true;
    
    const mockEvent = { target: document.createElement('div') } as any;
    component.onDocumentClick(mockEvent);
    
    expect(component.showMenuDropdown).toBe(false);
    expect(component.isMenuOpen).toBe(false);
  });
});