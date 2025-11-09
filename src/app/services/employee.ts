import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7204/api/Employee';

  registerEmployee(employee: Omit<Employee, 'employeeId'>): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }
}
