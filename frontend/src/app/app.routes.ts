import { Routes } from '@angular/router';
import { Login } from './login/login';
import { ServiciosComponent } from './servicios/servicios';
import { Clientes } from './clientes/clientes';
import { Dashboard } from './dashboard/dashboard';
import { Reportes } from './reportes/reportes';
import { Inventario } from './inventario/inventario';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'clientes', component: Clientes },
  { path: 'inventario', component: Inventario },
  { path: 'reportes', component: Reportes }
];