import { Component, inject, Output, EventEmitter, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-popup',
  imports: [FormsModule, CommonModule],
  templateUrl: './login-popup.html',
  styleUrls: ['./login-popup.scss']
})
export class LoginPopupComponent {
  @Output() closeLogin = new EventEmitter<void>();
  
  private router = inject(Router);
  private auth = inject(AuthService);
  
  username = signal('');
  password = signal('');
  error = signal('');
  isLoading = signal(false);

  login() {
    if (!this.validateForm()) return;
    
    this.isLoading.set(true);
    this.error.set('');
    
    this.auth.login(this.username(), this.password()).subscribe({
      next: success => {
        this.isLoading.set(false);
        if (success) {
          this.closeLogin.emit();
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        } else {
          this.error.set('Login failed. Please try again.');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.error.set('Invalid credentials. Please check your username and password.');
      }
    });
  }

  private validateForm(): boolean {
    if (!this.username().trim()) {
      this.error.set('Username is required');
      return false;
    }
    if (!this.password().trim()) {
      this.error.set('Password is required');
      return false;
    }
    if (this.username().length < 3) {
      this.error.set('Username must be at least 3 characters');
      return false;
    }
    return true;
  }

  close() {
    this.closeLogin.emit();
  }
}