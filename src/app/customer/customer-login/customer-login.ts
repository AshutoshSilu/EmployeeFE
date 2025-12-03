import { Component, inject, Output, EventEmitter, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './customer-login.html',
  styleUrls: ['./customer-login.scss']
})
export class CustomerLoginComponent {
  @Output() closeLogin = new EventEmitter<void>();
  
  private router = inject(Router);
  
  email = signal('');
  mobile = signal('');
  password = signal('');
  error = signal('');
  isLoading = signal(false);

  login() {
    if (!this.validateForm()) return;
    
    this.isLoading.set(true);
    this.error.set('');
    
    // Simulate login - replace with actual service call
    setTimeout(() => {
      this.isLoading.set(false);
      this.closeLogin.emit();
      this.router.navigate(['/customer']);
    }, 1000);
  }

  private validateForm(): boolean {
    if (!this.email().trim() && !this.mobile().trim()) {
      this.error.set('Email or Mobile is required');
      return false;
    }
    if (!this.password().trim()) {
      this.error.set('Password is required');
      return false;
    }
    return true;
  }

  close() {
    this.closeLogin.emit();
  }
}