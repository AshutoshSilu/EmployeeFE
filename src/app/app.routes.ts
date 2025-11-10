import { Routes } from '@angular/router';
import { HomePageComponent } from './Employee/home-page/home-page';
import { RegistrationComponent } from './Employee/registration/registration';
import { EmployeeComponent } from './Employee/employee/employee';
import { EmployeeDetails } from './employee-details/employee-details';
import { DashboardComponent } from './Employee/dashboard/dashboard';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'employee', component: EmployeeComponent, canActivate: [authGuard] },
  { path: 'employee-details/:id', component: EmployeeDetails, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
