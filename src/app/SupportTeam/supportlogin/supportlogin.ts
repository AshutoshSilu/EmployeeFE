import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-supportlogin',
  imports: [CommonModule, FormsModule],
  templateUrl: './supportlogin.html',
  styleUrls: ['./supportlogin.scss']
})
export class SupportLoginComponent {
  username = signal('');
  password = signal('');
  error = signal('');
  isLoading = signal(false);

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    if (!this.validateForm()) return;
    
    this.isLoading.set(true);
    this.error.set('');
    
    this.authService.login(this.username(), this.password()).subscribe({
      next: success => {
        this.isLoading.set(false);
        if (success) {
          this.router.navigate(['/support/chat-window']);
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
    return true;
  }

  goHome() {
    this.router.navigate(['/']);
  }
}