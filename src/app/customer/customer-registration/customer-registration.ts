import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService, CustomerData } from '../../services/customer';
import { CustomerLoginComponent } from '../customer-login/customer-login';

@Component({
  selector: 'app-customer-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerLoginComponent],
  templateUrl: './customer-registration.html',
  styleUrls: ['./customer-registration.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerRegistrationComponent {
  customerData: Omit<CustomerData, 'employeeId'> = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: ''
  };
  customerService = inject(CustomerService);
  private cdr = inject(ChangeDetectorRef);
  showLoginPopup = false;
  showCustomPopup = false;
  showCustomerExistsPopup = false;
  popupMessage = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (this.isFormValid()) {
      console.log('Validating customer data:', this.customerData);
      
      // First check if customer already exists
      const customerToCheck: CustomerData = { ...this.customerData, employeeId: undefined };
      this.customerService.checkCustomerExists(customerToCheck).subscribe({
        next: (response) => {
          if (response) {
            this.showCustomerExistsPopup = true;
            this.cdr.detectChanges();
          } else {
            // Customer doesn't exist, proceed with registration
            this.registerNewCustomer();
          }
        },
        error: (error) => {
          console.error('Error checking customer existence:', error);
          // If check fails, still attempt registration (backend will handle duplicates)
          this.registerNewCustomer();
          this.cdr.detectChanges();
        }
      });
    } else {
      this.showPopup('Please fill in all required fields.');
    }
  }

  private registerNewCustomer() {
    console.log('Registering new customer:', this.customerData);
    this.customerService.addCustomer(this.customerData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.showPopup('Registration successful! Please login with your credentials.');
        this.showLoginPopup = true;
        this.cdr.detectChanges();
        console.log('showLoginPopup set to:', this.showLoginPopup);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        if (error.status === 409) {
          this.showPopup('Customer already exists with this email.');
        } else {
          this.showPopup('Registration failed. Please try again.');
        }
        this.cdr.detectChanges();
      }
    });
  }

  closeLoginPopup() {
    this.showLoginPopup = false;
    this.cdr.detectChanges();
  }

  isFormValid(): boolean {
    return !!this.customerData.firstName && 
           !!this.customerData.lastName && 
           !!this.customerData.email && 
           this.isValidEmail(this.customerData.email) &&
           !!this.customerData.mobile && 
           this.customerData.mobile.length >= 10 &&
           !!this.customerData.password &&
           this.customerData.password.length >= 6;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showPopup(message: string) {
    this.popupMessage = message;
    this.showCustomPopup = true;
    this.cdr.detectChanges();
  }

  closeCustomPopup() {
    this.showCustomPopup = false;
    this.cdr.detectChanges();
  }

  closeCustomerExistsPopup() {
    this.showCustomerExistsPopup = false;
    this.cdr.detectChanges();
  }

  openLoginFromExists(event: Event) {
    event.preventDefault();
    this.showCustomerExistsPopup = false;
    this.showLoginPopup = true;
    this.cdr.detectChanges();
  }

  goBack() {
    this.router.navigate(['/customer']);
  }
}