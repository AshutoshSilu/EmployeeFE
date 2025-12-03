import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealSliderComponent } from '../meal-slider/meal-slider';
import { HeaderComponent } from '../../shared/header/header';
import { FooterComponent } from '../../shared/footer/footer';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, MealSliderComponent, HeaderComponent, FooterComponent],
  templateUrl: './customer-dashboard.html',
  styleUrls: ['./customer-dashboard.scss']
})
export class CustomerDashboardComponent {
  customerName = 'Welcome Customer';
}