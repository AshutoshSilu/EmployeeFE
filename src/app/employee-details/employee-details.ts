import { Component, Input, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-employee-details',
  imports: [CommonModule],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.scss',
})
export class EmployeeDetails implements OnInit {
  @Input() employee: Employee | null = null;
  
  selectedImage = signal('');
  
  employeeImage = computed(() => {
    return this.employee?.employeeId 
      ? `assets/UserImage/${this.employee.employeeId}.png`
      : '';
  });

  ngOnInit(): void {
    if(this.employee?.employeeId){
      this.selectedImage.set(`assets/UserImage/${this.employee.employeeId}.png`);
    }
  }
}
