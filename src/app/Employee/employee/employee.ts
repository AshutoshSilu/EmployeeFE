import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee';
import { HeaderComponent } from '../../shared/header';

import { RegistrationComponent } from '../registration/registration';

@Component({
  selector: 'app-employee',
  imports: [ReactiveFormsModule, RegistrationComponent],
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
  selectedImageUrl = signal<string | null>(null);
  selectedImageFile = signal<File | null>(null);
  editSelectedImageUrl = signal<string | null>(null);
  editSelectedImageFile = signal<File | null>(null);

  private createEmployeeFormGroup(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required]
    });
  }

  addEmployeeForm: FormGroup = this.createEmployeeFormGroup();
  editEmployeeForm: FormGroup = this.createEmployeeFormGroup();

  employees = computed(() => this.employeeService.employees());
  loading = computed(() => this.employeeService.loading());
  error = computed(() => this.employeeService.error());

  currentUser = signal<Employee | null>(null);
  
  departmentCount = computed(() => 
    new Set(this.employees().map(emp => emp.department)).size
  );
  
  recentCount = computed(() => this.employees().length);

  ngOnInit() {
    this.loadEmployees();
    this.getImageDetails();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  addEmployee() {
    this.showAddModal.set(true);
  }

  closeModal() {
    this.showAddModal.set(false);
    this.addEmployeeForm.reset();
    this.selectedImageUrl.set(null);
    this.selectedImageFile.set(null);
  }

  onImageSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImageFile.set(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImageUrl.set(e.target?.result as string);
      };
      reader.onerror = () => {
        console.error('Error reading file');
        this.selectedImageUrl.set(null);
        this.selectedImageFile.set(null);
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
    this.editSelectedImageUrl.set(null);
    this.editSelectedImageFile.set(null);
  }

  onEditImageSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.editSelectedImageFile.set(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.editSelectedImageUrl.set(e.target?.result as string);
      };
      reader.onerror = () => {
        console.error('Error reading file');
        this.editSelectedImageUrl.set(null);
        this.editSelectedImageFile.set(null);
      };
      reader.readAsDataURL(file);
    } else {
      console.warn('Invalid file type selected');
    }
  }

  viewEmployeeDetails(employee: Employee) {
    this.selectedEmployee.set(employee);
    this.getImageDetails();
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
        next: () => {
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
    if (!this.editEmployeeForm.valid) {
      this.markFormGroupTouched(this.editEmployeeForm);
      return;
    }

    const editing = this.editingEmployee();
    if (!editing) {
      console.error('No employee selected for editing.');
      alert('No employee selected to update. Please select an employee and try again.');
      return;
    }

    const employeeId = editing.employeeId;
    const updatedData = this.editEmployeeForm.value;

    this.employeeService.updateEmployee(employeeId, updatedData).subscribe({
      next: () => {
        this.closeEditModal();
      },
      error: (error) => {
        console.error('Error updating employee:', error);
        alert('Failed to update employee. Please try again later.');
      }
    });
  }

  private getEmployeeFullName(employeeId: number): string {
    const employee = this.employees().find(emp => emp.employeeId === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'this employee';
  }

  private handleEmployeeDeletion(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        if (this.currentUser()?.employeeId === employeeId) {
          this.currentUser.set(this.employees().length > 0 ? this.employees()[0] : null);
        }
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
      }
    });
  }

  deleteEmployee(employeeId: number): void {
    const employeeName = this.getEmployeeFullName(employeeId);
    if (confirm(`Are you sure you want to delete ${employeeName}?`)) {
      this.handleEmployeeDeletion(employeeId);
    }
  }



  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }



  getImageDetails() {
    if (this.selectedEmployee()?.employeeId) {
      this.selectedImageUrl.set(`assets/UserImage/${this.selectedEmployee()?.employeeId}.png`);
    }
  }

  closePortal() {
    this.router.navigate(['/dashboard']);
  }

  generatePDF() {
    const employee = this.selectedEmployee();
    if (!employee) return;

    // Sanitize employee data to prevent XSS
    const sanitize = (str: string) => str.replace(/[<>"'&]/g, (match) => {
      const map: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '&': '&amp;'
      };
      return map[match];
    });

    const firstName = sanitize(employee.firstName);
    const lastName = sanitize(employee.lastName);
    const department = sanitize(employee.department);
    const employeeId = String(employee.employeeId).replace(/[^0-9]/g, '');

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
                ${firstName.charAt(0)}${lastName.charAt(0)}
              </div>
            </div>
            <div style="flex: 1; color: white;">
              <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">${firstName} ${lastName}</div>
              <div style="font-size: 12px; color: rgba(255,255,255,0.8); margin-bottom: 3px;">ID: ${employeeId}</div>
              <div style="font-size: 11px; color: rgba(255,255,255,0.7);">${department}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Failed to open print window. Please check if pop-ups are blocked.');
      }
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error('Error while printing:', error);
      alert('Failed to generate PDF. Please check if pop-ups are allowed and try again.');
    }
  }
}
