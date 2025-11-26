import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealSliderComponent } from '../meal-slider/meal-slider';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, MealSliderComponent],
  templateUrl: './customer-dashboard.html',
  styleUrls: ['./customer-dashboard.scss']
})
export class CustomerDashboardComponent {
  customerName = 'Welcome Customer';
}