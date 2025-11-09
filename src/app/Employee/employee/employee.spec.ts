import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { provideZoneChangeDetection } from '@angular/core';
import { EmployeeComponent } from './employee';
import { EmployeeService } from '../../services/employee';

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getAllEmployees', 'registerEmployee']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EmployeeComponent, ReactiveFormsModule],
      providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    mockEmployeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    mockEmployeeService.getAllEmployees.and.returnValue(of([]));
    expect(component).toBeTruthy();
  });

  it('should load employees on init', () => {
    const mockEmployees = [{ employeeId: 1, firstName: 'John', lastName: 'Doe', email: 'john@test.com', department: 'IT' }];
    mockEmployeeService.getAllEmployees.and.returnValue(of(mockEmployees));
    
    component.ngOnInit();
    
    expect(component.employees()).toEqual(mockEmployees);
  });

  it('should set active tab', () => {
    component.setActiveTab('employees');
    expect(component.activeTab()).toBe('employees');
  });

  it('should open add modal', () => {
    component.addEmployee();
    expect(component.showAddModal()).toBe(true);
  });

  it('should close modal and reset form', () => {
    component.showAddModal.set(true);
    component.closeModal();
    expect(component.showAddModal()).toBe(false);
  });

  it('should delete employee', () => {
    const mockEmployees = [
      { employeeId: 1, firstName: 'John', lastName: 'Doe', email: 'john@test.com', department: 'IT' },
      { employeeId: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', department: 'HR' }
    ];
    component.employees.set(mockEmployees);
    spyOn(window, 'confirm').and.returnValue(true);
    
    component.deleteEmployee(1);
    
    expect(component.employees().length).toBe(1);
    expect(component.employees()[0].employeeId).toBe(2);
  });
});