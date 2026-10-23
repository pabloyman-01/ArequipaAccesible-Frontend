import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'ciudadano',
    loadChildren: () =>
      import('./features/citizen/citizen.routes').then((module) => module.CITIZEN_ROUTES),
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
