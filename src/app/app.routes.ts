import { Routes } from '@angular/router';
import { HomePageComponent } from './Employee/home-page/home-page';
import { LoginComponent } from './Employee/login/login';
import { RegistrationComponent } from './Employee/registration/registration';
import { EmployeeComponent } from './Employee/employee/employee';
import { EmployeeDetails } from './employee-details/employee-details';
import { DashboardComponent } from './Employee/dashboard/dashboard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'employee-portal', component: EmployeeComponent },
  { path: 'employee-details/:id', component: EmployeeDetails },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }

];
