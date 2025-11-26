import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface MealPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  items: string[];
}

@Component({
  selector: 'app-meal-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meal-slider.html',
  styleUrls: ['./meal-slider.scss']
})
export class MealSliderComponent {
  mealPackages: MealPackage[] = [
    {
      id: 1,
      name: 'Healthy Breakfast',
      description: 'Start your day with nutritious meals',
      price: 299,
      image: 'assets/img/food/burger.jpg',
      items: ['Oats', 'Fresh Fruits', 'Juice', 'Yogurt']
    },
    {
      id: 2,
      name: 'Power Lunch',
      description: 'Energizing lunch for busy professionals',
      price: 399,
      image: 'assets/img/food/Pizza.jpg',
      items: ['Rice', 'Dal', 'Vegetables', 'Salad']
    },
    {
      id: 3,
      name: 'Comfort Dinner',
      description: 'Wholesome dinner to end your day',
      price: 449,
      image: 'assets/img/food/burger.jpg',
      items: ['Roti', 'Curry', 'Rice', 'Dessert']
    }
  ];

  constructor(private router: Router) {}

  onMealClick(mealId: number) {
    this.router.navigate(['/customer/register']);
  }
}