import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Employee } from '../models/employee.model';



@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7204/api/Employee';
  
  private employeesSignal = signal<Employee[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);
  
  readonly employees = this.employeesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  registerEmployee(employee: Omit<Employee, 'employeeId'>): Observable<Employee> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.post<Employee>(this.apiUrl, employee).pipe(
      tap({
        next: (newEmployee) => {
          this.employeesSignal.update(employees => [...employees, newEmployee]);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message || 'Failed to register employee');
          this.loadingSignal.set(false);
        }
      })
    );
  }

  getEmployee(id: number): Observable<Employee> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.get<Employee>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => this.loadingSignal.set(false),
        error: (error) => {
          this.errorSignal.set(error.message || 'Failed to get employee');
          this.loadingSignal.set(false);
        }
      })
    );
  }

  getAllEmployees(): Observable<Employee[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.get<Employee[]>(this.apiUrl).pipe(
      tap({
        next: (employees) => {
          this.employeesSignal.set(employees);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message || 'Failed to load employees');
          this.loadingSignal.set(false);
        }
      })
    );
  }
  
  updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee).pipe(
      tap({
        next: (updatedEmployee) => {
          this.employeesSignal.update(employees => 
            employees.map(emp => emp.employeeId === id ? updatedEmployee : emp)
          );
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message || 'Failed to update employee');
          this.loadingSignal.set(false);
        }
      })
    );
  }
  
  deleteEmployee(id: number): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => {
          this.employeesSignal.update(employees => 
            employees.filter(emp => emp.employeeId !== id)
          );
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message || 'Failed to delete employee');
          this.loadingSignal.set(false);
        }
      })
    );
  }
}
