import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7204/api/auth';
  private readonly jwtHelper = new JwtHelperService();
  
  private tokenSignal = signal<string | null>(this.getStoredToken());
  private currentUserSignal = signal<any>(null);
  
  readonly token = this.tokenSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => {
    const token = this.tokenSignal();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  });

  constructor() {
    this.updateCurrentUser();
  }

  private getStoredToken(): string | null {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  }

  getCurrentUser(): any {
    return this.currentUserSignal();
  }

  login(username: string, password: string): Observable<boolean> {
    const sanitizedUsername = username?.trim().replace(/[<>"'&]/g, '');
    const sanitizedPassword = password?.trim();
    
    if (!sanitizedUsername || !sanitizedPassword) {
      return throwError(() => new Error('Invalid credentials'));
    }
    
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { 
      username: sanitizedUsername, 
      password: sanitizedPassword 
    })
    .pipe(
      map(response => {
        if (response?.token) {
          try {
            localStorage.setItem('token', response.token);
            this.tokenSignal.set(response.token);
            this.updateCurrentUser();
            return true;
          } catch (error) {
            console.error('Failed to store token:', error);
            return false;
          }
        }
        return false;
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return of(false);
      })
    );
  }

  logout(): void {
    try {
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private updateCurrentUser(): void {
    const token = this.tokenSignal();
    if (token) {
      try {
        if (!this.jwtHelper.isTokenExpired(token)) {
          const decoded = this.jwtHelper.decodeToken(token);
          this.currentUserSignal.set(decoded);
        } else {
          this.logout();
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        this.logout();
      }
    } else {
      this.currentUserSignal.set(null);
    }
  }
}
