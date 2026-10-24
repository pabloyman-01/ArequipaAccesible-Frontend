import { roleGuard } from '../../core/auth.guard';
import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivateChild: [roleGuard('ADMINISTRADOR')],
    children: [
      {
        path: 'reportes/:id',
        loadComponent: () =>
          import('../../shared/report-detail/report-detail').then((m) => m.ReportDetail),
      },
      {
        path: '',
        pathMatch: 'full',
        title: 'Dashboard | Arequipa Accesible',
        data: { breadcrumb: 'Dashboard de Gestión' },
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((module) => module.Dashboard),
      },
      {
        path: 'reportes',
        title: 'Gestión de Reportes | Arequipa Accesible',
        data: { breadcrumb: 'Plataforma Municipal de Accesibilidad' },
        loadComponent: () => import('./pages/reports/reports').then((module) => module.Reports),
      },
      {
        path: 'usuarios',
        title: 'Gestión de Usuarios | Arequipa Accesible',
        data: { breadcrumb: 'Plataforma Municipal de Accesibilidad' },
        loadComponent: () => import('./pages/users/users').then((module) => module.Users),
      },
      {
        path: 'cuenta',
        title: 'Mi Cuenta | Arequipa Accesible',
        data: { breadcrumb: 'Mi cuenta' },
        loadComponent: () =>
          import('./pages/account/account').then((module) => module.AdminAccount),
      },
    ],
  },
];
