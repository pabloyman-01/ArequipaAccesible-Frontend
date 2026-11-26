import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'inicio-sesion',
    loadChildren: () => import('./features/auth/auth.routes').then((module) => module.AUTH_ROUTES),
  },
  {
    path: 'ciudadano',
    loadChildren: () =>
      import('./features/citizen/citizen.routes').then((module) => module.CITIZEN_ROUTES),
  },
  {
    path: 'mapa',
    loadComponent: () => import('./features/public-map/public-map').then((m) => m.PublicMap),
  },
  {
    path: '',
    loadChildren: () => import('./features/admin/admin.routes').then((module) => module.ADMIN_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
