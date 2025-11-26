import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import emailjs from '@emailjs/browser';
const EMAIL_CONFIG = {
  SERVICE_ID: 'service_magicmeal',
  TEMPLATE_ID: 'template_nbvrhbn',
  PUBLIC_KEY: 'fTdrsEq-fl4k-8Blx'
} as const;

const MESSAGES = {
  SUCCESS: 'Message sent successfully!',
  ERROR: 'Failed to send message. Please try again.',
  VALIDATION_ERROR: 'Please fill all required fields correctly.'
} as const;

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contactus.html',
  styleUrl: './contactus.scss'
})
export class ContactUsComponent implements OnInit, OnDestroy {
  // Public properties
  public contactForm!: FormGroup;
  public isSubmitting = false;
  public submitMessage = '';
  public isSuccess = false;

  // Private properties
  private timeoutId?: number;

  constructor(
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeEmailJS();
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  // Public methods
  public async onSubmit(): Promise<void> {
    this.contactForm.markAllAsTouched();

    if (!this.contactForm.valid) {
      this.handleValidationError();
      return;
    }

    await this.sendEmail();
  }

  public getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (!field?.errors || !field.touched) return '';

    const errors = field.errors;
    if (errors['required']) return `${this.capitalizeFirst(fieldName)} is required`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `${this.capitalizeFirst(fieldName)} must be at least ${requiredLength} characters`;
    }
    return '';
  }

  // Private methods
  private initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  private initializeEmailJS(): void {
    try {
      emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
    }
  }

  private async sendEmail(): Promise<void> {
    this.setSubmissionState(true);
    
    try {
      await emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID, {
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        message: this.contactForm.value.message
      });
      this.handleSuccess();
    } catch (error) {
      console.error('EmailJS error:', error);
      this.handleError();
    }
  }

  private handleSuccess(): void {
    setTimeout(() => {
      this.submitMessage = MESSAGES.SUCCESS;
      this.isSuccess = true;
      this.setSubmissionState(false);
      this.contactForm.reset();
      this.cdr.detectChanges();

      this.timeoutId = window.setTimeout(() => {
        this.clearMessage();
      }, 5000);
    });
  }

  private handleError(): void {
    setTimeout(() => {
      this.submitMessage = MESSAGES.ERROR;
      this.isSuccess = false;
      this.setSubmissionState(false);
      this.cdr.detectChanges();
    });
  }

  private handleValidationError(): void {
    this.submitMessage = MESSAGES.VALIDATION_ERROR;
    this.isSuccess = false;
  }

  private setSubmissionState(isSubmitting: boolean): void {
    this.isSubmitting = isSubmitting;
    if (isSubmitting) {
      this.submitMessage = '';
      this.isSuccess = false;
    }
  }

  private clearMessage(): void {
    this.submitMessage = '';
    this.cdr.detectChanges();
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }



}
