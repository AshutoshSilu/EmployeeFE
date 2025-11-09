import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { provideZoneChangeDetection } from '@angular/core';
import { RegistrationComponent } from './registration';
import { EmployeeService } from '../../services/employee';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['registerEmployee']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegistrationComponent, ReactiveFormsModule],
      providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    mockEmployeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with validators', () => {
    expect(component.registrationForm.get('firstName')?.hasError('required')).toBe(true);
    expect(component.registrationForm.get('email')?.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    const emailControl = component.registrationForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should submit form when valid', () => {
    const mockEmployee = { employeeId: 1, firstName: 'John', lastName: 'Doe', email: 'john@test.com', department: 'IT' };
    mockEmployeeService.registerEmployee.and.returnValue(of(mockEmployee));
    
    component.registrationForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      department: 'IT'
    });
    
    component.onSubmit();
    
    expect(mockEmployeeService.registerEmployee).toHaveBeenCalled();
  });

  it('should handle image selection', () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = { target: { files: [mockFile] } } as any;
    
    component.onImageSelect(mockEvent);
    
    expect(component.selectedFile).toBe(mockFile);
  });

  it('should navigate back', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});