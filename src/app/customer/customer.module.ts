import { Routes } from '@angular/router';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard';
import { MealSubscriptionComponent } from './meal-subscription/meal-subscription';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration';

export const customerRoutes: Routes = [
  { path: '', component: CustomerDashboardComponent },
  { path: 'register', component: CustomerRegistrationComponent },
  { path: 'subscription/:mealId', component: MealSubscriptionComponent }
];

export class CustomerModule { }