import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface CustomerData {
  employeeId?: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}

const API_URL = 'https://localhost:7204/api/';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);

  customers = signal<CustomerData[]>([]);
  loadingSignal = signal<boolean>(false);
  errorSignal = signal<string>('');

  checkCustomerExists(customer: CustomerData): Observable<{ exists: boolean; customer?: CustomerData }> {
    const params = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      mobile: customer.mobile,
      password: customer.password
    };
    return this.http.get<{ exists: boolean; customer?: CustomerData }>(`${API_URL}Customer/GetCustomer`, { params });
  }

  addCustomer(customer: Omit<CustomerData, 'employeeId'>): Observable<CustomerData> {
    this.loadingSignal.set(true);
    this.errorSignal.set('');
    return this.http.post<CustomerData>(`${API_URL}Customer/AddCustomer`, customer).pipe(
      tap({
        next: (newCustomer: CustomerData) => {
          this.customers.update((customers: CustomerData[]) => [...customers, newCustomer]);
          this.loadingSignal.set(false);
        },
        error: (error: any) => {
          this.errorSignal.set(error.message || 'Failed to add customer');
          this.loadingSignal.set(false);
        }
      })
    );
  }
}

// Keep the old Customer class for backward compatibility
export class Customer extends CustomerService {}
