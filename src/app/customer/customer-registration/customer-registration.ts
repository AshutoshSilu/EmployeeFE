import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-registration.html',
  styleUrls: ['./customer-registration.scss']
})
export class CustomerRegistrationComponent {
  customerData = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    if (this.isFormValid()) {
      alert('Registration successful! You can now subscribe to meal packages.');
      this.router.navigate(['/customer']);
    }
  }

  isFormValid(): boolean {
    return !!this.customerData.firstName && 
           !!this.customerData.lastName && 
           !!this.customerData.email && 
           !!this.customerData.mobile && 
           !!this.customerData.password;
  }

  goBack() {
    this.router.navigate(['/customer']);
  }
}