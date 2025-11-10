import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
})
export class RegistrationComponent {
  @Output() closeRegistration = new EventEmitter<void>();
  
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  
  selectedImageUrl = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  isSubmitting = signal(false);
  error = signal<string | null>(null);
  
  registrationForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['', Validators.required]
  });

  onImageSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImageUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.isSubmitting.set(true);
      this.error.set(null);
      
      const employeeData = {
        firstName: this.registrationForm.get('firstName')?.value,
        lastName: this.registrationForm.get('lastName')?.value,
        email: this.registrationForm.get('email')?.value,
        department: this.registrationForm.get('department')?.value
      };

      this.employeeService.registerEmployee(employeeData).subscribe({
        next: (response) => {
          console.log('Employee registered successfully:', response);
          this.isSubmitting.set(false);
          this.closeRegistration.emit();
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.error.set('Registration failed. Please try again.');
          this.isSubmitting.set(false);
        }
      });
    } else {
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack() {
    this.closeRegistration.emit();
  }
  
  close() {
    this.closeRegistration.emit();
  }
}
