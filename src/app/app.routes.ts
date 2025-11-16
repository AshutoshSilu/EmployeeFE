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
import { Adslider } from './Employee/Adslider/adslider';
import { MenuPageComponent } from './menu/menu-page';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'order-now', component: OrderNowComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'employee', component: EmployeeComponent, canActivate: [authGuard] },
  { path: 'employee-details/:id', component: EmployeeDetails, canActivate: [authGuard] },
  { path: 'offers', component: Offers },
  { path: 'ad-slider', component: Adslider },
  
  // Menu routes
  { path: 'menu/appetizers/salads', component: MenuPageComponent, data: { title: 'Salads', description: 'Fresh and healthy salad options' } },
  { path: 'menu/appetizers/soups', component: MenuPageComponent, data: { title: 'Soups', description: 'Warm and comforting soup varieties' } },
  { path: 'menu/appetizers/starters', component: MenuPageComponent, data: { title: 'Starters', description: 'Delicious appetizers to begin your meal' } },
  
  { path: 'menu/main-course/rice', component: MenuPageComponent, data: { title: 'Rice Dishes', description: 'Aromatic rice preparations' } },
  { path: 'menu/main-course/curry', component: MenuPageComponent, data: { title: 'Curries', description: 'Rich and flavorful curry dishes' } },
  { path: 'menu/main-course/biryani', component: MenuPageComponent, data: { title: 'Biryani', description: 'Authentic biryani varieties' } },
  { path: 'menu/main-course/dal', component: MenuPageComponent, data: { title: 'Dal & Lentils', description: 'Protein-rich lentil preparations' } },
  
  { path: 'menu/breads/roti', component: MenuPageComponent, data: { title: 'Roti', description: 'Traditional Indian flatbreads' } },
  { path: 'menu/breads/naan', component: MenuPageComponent, data: { title: 'Naan', description: 'Soft and fluffy naan varieties' } },
  { path: 'menu/breads/paratha', component: MenuPageComponent, data: { title: 'Paratha', description: 'Stuffed and plain paratha options' } },
  
  { path: 'menu/desserts/sweets', component: MenuPageComponent, data: { title: 'Traditional Sweets', description: 'Authentic Indian desserts' } },
  { path: 'menu/desserts/ice-cream', component: MenuPageComponent, data: { title: 'Ice Cream', description: 'Cool and creamy ice cream flavors' } },
  { path: 'menu/desserts/cakes', component: MenuPageComponent, data: { title: 'Cakes', description: 'Freshly baked cake varieties' } },
  
  { path: 'menu/beverages/hot', component: MenuPageComponent, data: { title: 'Hot Drinks', description: 'Warm beverages for every mood' } },
  { path: 'menu/beverages/cold', component: MenuPageComponent, data: { title: 'Cold Drinks', description: 'Refreshing cold beverages' } },
  { path: 'menu/beverages/juices', component: MenuPageComponent, data: { title: 'Fresh Juices', description: 'Freshly squeezed fruit juices' } },
  
  { path: '**', redirectTo: '' },
];
