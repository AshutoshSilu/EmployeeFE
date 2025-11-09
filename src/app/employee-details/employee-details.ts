import { Component, Input, OnInit } from '@angular/core';
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
  selectctedImage: string = '';

  ngOnInit(): void {
    if(this.employee?.employeeId){
      this.selectctedImage = `assets/UserImage/${this.employee.employeeId}.png`;
    }
  }
}
