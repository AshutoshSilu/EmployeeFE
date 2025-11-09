import { Component, inject } from '@angular/core';
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
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  selectedImageUrl: string | null = null;
  selectedFile: File | null = null;
  
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
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImageUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const employeeData = {
        firstName: this.registrationForm.get('firstName')?.value,
        lastName: this.registrationForm.get('lastName')?.value,
        email: this.registrationForm.get('email')?.value,
        department: this.registrationForm.get('department')?.value,
        image: this.registrationForm.get('image')?.value
      };

      this.employeeService.registerEmployee(employeeData).subscribe({
        next: (response) => {
          console.log('Employee registered successfully:', response);
          this.router.navigate(['/employee-portal']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
        }
      });
    } else {
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
