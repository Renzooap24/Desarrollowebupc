import { Routes } from '@angular/router';
import { Login } from './login/login';
import { ServiciosComponent } from './servicios/servicios';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'servicios', component: ServiciosComponent }
];