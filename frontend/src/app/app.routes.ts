import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Clientes } from './pages/clientes/clientes';
import { Proveedores } from './pages/proveedores/proveedores';
import { Productos } from './pages/productos/productos';
import { Ventas } from './pages/ventas/ventas';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'clientes', component: Clientes },
  { path: 'proveedores', component: Proveedores },
  { path: 'productos', component: Productos },
  { path: 'ventas', component: Ventas },
  { path: '**', redirectTo: '' },
];
