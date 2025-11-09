import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header';
import { FooterComponent } from '../../shared/footer';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);
  
  user: any = {};

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.user = this.auth.getCurrentUser() || {
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'IT',
      position: 'Software Developer',
      joinDate: '2023-01-15'
    };
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}