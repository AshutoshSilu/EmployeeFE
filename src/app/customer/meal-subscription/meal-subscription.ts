import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface SubscriptionPlan {
  id: number;
  duration: string;
  price: number;
  discount: number;
}

@Component({
  selector: 'app-meal-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meal-subscription.html',
  styleUrls: ['./meal-subscription.scss']
})
export class MealSubscriptionComponent implements OnInit {
  mealId: number = 0;
  selectedPlan: number = 1;
  
  subscriptionPlans: SubscriptionPlan[] = [
    { id: 1, duration: '1 Week', price: 1999, discount: 0 },
    { id: 2, duration: '1 Month', price: 7499, discount: 10 },
    { id: 3, duration: '3 Months', price: 19999, discount: 20 }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.mealId = Number(this.route.snapshot.paramMap.get('mealId'));
  }

  selectPlan(planId: number) {
    this.selectedPlan = planId;
  }

  subscribe() {
    this.router.navigate(['/customer']);
  }

  goBack() {
    this.router.navigate(['/customer']);
  }
}