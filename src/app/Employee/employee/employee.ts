import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee';
import { HeaderComponent } from '../../shared/header';
import { RegistrationComponent } from '../registration/registration';
import { FooterComponent } from "../../shared";

interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  image?: string;
}

@Component({
  selector: 'app-employee',
  imports: [ReactiveFormsModule, RegistrationComponent, HeaderComponent],
  templateUrl: './employee.html',
  styleUrls: ['./employee.scss', './employee-theme.scss'],
})
export class EmployeeComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  activeTab = signal('dashboard');
  showAddModal = signal(false);
  showEditModal = signal(false);
  showDetailsModal = signal(false);
  editingEmployee = signal<Employee | null>(null);
  selectedEmployee = signal<Employee | null>(null);
  selectedImageUrl: string | null = null;
  selectedImageFile: File | null = null;
  editSelectedImageUrl: string | null = null;
  editSelectedImageFile: File | null = null;

  addEmployeeForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['', Validators.required]
  });

  editEmployeeForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['', Validators.required]
  });

  employees = signal<Employee[]>([]);

  currentUser = signal<Employee | null>(null);

  ngOnInit() {
    this.loadEmployees();
    this.getTmagedetails();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  getDepartmentCount(): number {
    return new Set(this.employees().map(emp => emp.department)).size;
  }

  getRecentCount(): number {
    return this.employees().length;
  }

  addEmployee() {
    this.showAddModal.set(true);
  }

  closeModal() {
    this.showAddModal.set(false);
    this.addEmployeeForm.reset();
    this.selectedImageUrl = null;
    this.selectedImageFile = null;
  }

  onImageSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImageUrl = e.target?.result as string;
      };
      reader.onerror = () => {
        console.error('Error reading file');
        this.selectedImageUrl = null;
        this.selectedImageFile = null;
      };
      reader.readAsDataURL(file);
    } else {
      console.warn('Invalid file type selected');
    }
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editEmployeeForm.reset();
    this.editingEmployee.set(null);
    this.editSelectedImageUrl = null;
    this.editSelectedImageFile = null;
  }

  onEditImageSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.editSelectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.editSelectedImageUrl = e.target?.result as string;
      };
      reader.onerror = () => {
        console.error('Error reading file');
        this.editSelectedImageUrl = null;
        this.editSelectedImageFile = null;
      };
      reader.readAsDataURL(file);
    } else {
      console.warn('Invalid file type selected');
    }
  }

  viewEmployeeDetails(employee: Employee) {
    this.selectedEmployee.set(employee);
    this.getTmagedetails();
    this.showDetailsModal.set(true);
  }

  closeDetailsModal() {
    this.showDetailsModal.set(false);
    this.selectedEmployee.set(null);
  }

  onSubmitEmployee() {
    if (this.addEmployeeForm.valid) {
      const employeeData = this.addEmployeeForm.value;

      this.employeeService.registerEmployee(employeeData).subscribe({
        next: (employee) => {
          this.employees.set([...this.employees(), employee]);
          this.closeModal();
        },
        error: (error: any) => {
          console.error('Error adding employee:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.addEmployeeForm);
    }
  }

  editEmployee(employee: Employee) {
    this.editingEmployee.set(employee);
    this.editEmployeeForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department
    });
    this.showEditModal.set(true);
  }

  onSubmitEditEmployee() {
    if (this.editEmployeeForm.valid && this.editingEmployee()) {
      const employeeId = this.editingEmployee()!.employeeId;
      const updatedData = this.editEmployeeForm.value;

      this.updateEmployeeLocally(employeeId, updatedData);
      this.closeEditModal();
    } else {
      this.markFormGroupTouched(this.editEmployeeForm);
    }
  }

  deleteEmployee(employeeId: number) {
    const employee = this.employees().find(emp => emp.employeeId === employeeId);
    const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'this employee';

    if (confirm(`Are you sure you want to delete ${employeeName}?`)) {
      const updatedEmployees = this.employees().filter(emp => emp.employeeId !== employeeId);
      this.employees.set(updatedEmployees);

      if (this.currentUser()?.employeeId === employeeId) {
        this.currentUser.set(updatedEmployees.length > 0 ? updatedEmployees[0] : null);
      }
    }
  }



  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  private updateEmployeeLocally(employeeId: number, updatedData: any): void {
    const currentEmployees = this.employees();
    const index = currentEmployees.findIndex(emp => emp.employeeId === employeeId);
    if (index !== -1) {
      currentEmployees[index] = { ...currentEmployees[index], ...updatedData };
      this.employees.set([...currentEmployees]);
    }
  }

  getTmagedetails() {
    if (this.selectedEmployee()?.employeeId) {
      this.selectedImageUrl = `assets/UserImage/${this.selectedEmployee()?.employeeId}.png`;
    }
  }

  closePortal() {
    this.router.navigate(['/']);
  }

  generatePDF() {
    const employee = this.selectedEmployee();
    if (!employee) return;

    const printContent = `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0; padding: 20px;">
        <div style="width: 350px; height: 220px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 75%, #533483 100%); border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); position: relative; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #00d4ff, #5b86e5, #36d1dc); height: 4px; width: 100%;"></div>
          <div style="padding: 15px 20px 10px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.2);">
            <div style="color: white; font-size: 18px; font-weight: bold; margin-bottom: 2px;">☕ THE CAFFEINE CAPPER</div>
            <div style="color: rgba(255,255,255,0.8); font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Employee Identification Card</div>
          </div>
          <div style="padding: 15px 20px; display: flex; gap: 15px; align-items: center;">
            <div style="width: 70px; height: 70px; border-radius: 10px; border: 2px solid #00d4ff; overflow: hidden; flex-shrink: 0; background: rgba(255,255,255,0.1);">
              <div style="width: 100%; height: 100%; background: #00d4ff; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px;">
                ${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}
              </div>
            </div>
            <div style="flex: 1; color: white;">
              <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">${employee.firstName} ${employee.lastName}</div>
              <div style="font-size: 12px; color: rgba(255,255,255,0.8); margin-bottom: 3px;">ID: ${employee.employeeId}</div>
              <div style="font-size: 11px; color: rgba(255,255,255,0.7);">${employee.department}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
