import { Injectable, signal, computed } from '@angular/core';

export interface AppError {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: Date;
  autoClose?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorsSignal = signal<AppError[]>([]);
  
  readonly errors = this.errorsSignal.asReadonly();
  readonly hasErrors = computed(() => this.errors().length > 0);
  readonly errorCount = computed(() => this.errors().length);

  addError(message: string, type: AppError['type'] = 'error', autoClose = true) {
    const error: AppError = {
      id: this.generateId(),
      message,
      type,
      timestamp: new Date(),
      autoClose
    };

    this.errorsSignal.update(errors => [...errors, error]);

    if (autoClose) {
      setTimeout(() => this.removeError(error.id), 5000);
    }

    return error.id;
  }

  removeError(id: string) {
    this.errorsSignal.update(errors => errors.filter(error => error.id !== id));
  }

  clearAllErrors() {
    this.errorsSignal.set([]);
  }

  addSuccess(message: string) {
    return this.addError(message, 'success');
  }

  addWarning(message: string) {
    return this.addError(message, 'warning');
  }

  addInfo(message: string) {
    return this.addError(message, 'info');
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}