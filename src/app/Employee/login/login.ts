import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../../shared/header';
import { FooterComponent } from '../../shared/footer';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class LoginComponent {
  private router = inject(Router);
  private auth = inject(AuthService);
  
  username = '';
  password = '';
  error = '';
  isLoading = false;

  login() {
    if (!this.validateForm()) return;
    
    this.isLoading = true;
    this.error = '';
    
    this.auth.login(this.username, this.password).subscribe({
      next: success => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Login failed. Please try again.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Invalid credentials. Please check your username and password.';
      }
    });
  }

  private validateForm(): boolean {
    if (!this.username.trim()) {
      this.error = 'Username is required';
      return false;
    }
    if (!this.password.trim()) {
      this.error = 'Password is required';
      return false;
    }
    if (this.username.length < 3) {
      this.error = 'Username must be at least 3 characters';
      return false;
    }
    return true;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
