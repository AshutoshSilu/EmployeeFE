import { Injectable, signal, computed } from '@angular/core';

export interface AppState {
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private stateSignal = signal<AppState>({
    isLoading: false,
    error: null,
    theme: 'light'
  });

  readonly state = this.stateSignal.asReadonly();
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);
  readonly theme = computed(() => this.state().theme);

  setLoading(loading: boolean) {
    this.stateSignal.update(state => ({ ...state, isLoading: loading }));
  }

  setError(error: string | null) {
    this.stateSignal.update(state => ({ ...state, error }));
  }

  setTheme(theme: 'light' | 'dark') {
    this.stateSignal.update(state => ({ ...state, theme }));
    localStorage.setItem('theme', theme);
  }

  clearError() {
    this.setError(null);
  }

  constructor() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
  }
}