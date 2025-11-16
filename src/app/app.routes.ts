import { Routes } from '@angular/router';
import { HomePageComponent } from './Employee/home-page/home-page';
import { RegistrationComponent } from './Employee/registration/registration';
import { EmployeeComponent } from './Employee/employee/employee';
import { EmployeeDetails } from './employee-details/employee-details';
import { DashboardComponent } from './Employee/dashboard/dashboard';
import { OrderNowComponent } from './Employee/order-now/order-now';
import { CheckoutComponent } from './Employee/checkout/checkout';
import { authGuard, loginGuard } from './guards/auth.guard';
import { Offers } from './shared/offers/offers';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'order-now', component: OrderNowComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'employee', component: EmployeeComponent, canActivate: [authGuard] },
  { path: 'employee-details/:id', component: EmployeeDetails, canActivate: [authGuard] },
  { path: 'offers', component: Offers },
  { path: '**', redirectTo: '' },

];
