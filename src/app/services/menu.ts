import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Menu {
  menuId: string;
  menuName: string;
  type: string;
  availability: string;
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7204/api/Menu';
  
  private menusSignal = signal<Menu[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);
  
  readonly menus = this.menusSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  getAllMenus(): Observable<Menu[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.get<Menu[]>(this.apiUrl).pipe(
      tap({
        next: (menus) => {
          this.menusSignal.set(menus);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message || 'Failed to load menus');
          this.loadingSignal.set(false);
        }
      })
    );
  }

  getMenu(id: string): Observable<Menu> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.get<Menu>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => this.loadingSignal.set(false),
        error: (error) => {
          this.errorSignal.set(error.message || 'Failed to get menu');
          this.loadingSignal.set(false);
        }
      })
    );
  }

  addMenu(menu: Menu): Observable<Menu> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.post<Menu>(this.apiUrl, menu).pipe(
      tap({
        next: (newMenu) => {
          this.menusSignal.update(menus => [...menus, newMenu]);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message || 'Failed to add menu');
          this.loadingSignal.set(false);
        }
      })
    );
  }

  updateMenu(id: string, menu: Menu): Observable<Menu> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.put<Menu>(`${this.apiUrl}/${id}`, menu).pipe(
      tap({
        next: (updatedMenu) => {
          this.menusSignal.update(menus => 
            menus.map(m => m.menuId === id ? updatedMenu : m)
          );
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message || 'Failed to update menu');
          this.loadingSignal.set(false);
        }
      })
    );
  }

  deleteMenu(id: string): Observable<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => {
          this.menusSignal.update(menus => 
            menus.filter(m => m.menuId !== id)
          );
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message || 'Failed to delete menu');
          this.loadingSignal.set(false);
        }
      })
    );
  }
}