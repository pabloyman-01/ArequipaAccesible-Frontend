import { roleGuard } from '../../core/auth.guard';
import { Routes } from '@angular/router';
import { CitizenLayout } from './layout/citizen-layout';

export const CITIZEN_ROUTES: Routes = [
  {
    path: '',
    component: CitizenLayout,
    canActivateChild: [roleGuard('CIUDADANO')],
    children: [
      {
        path: 'reportes/:id',
        loadComponent: () =>
          import('../../shared/report-detail/report-detail').then((m) => m.ReportDetail),
      },
      {
        path: '',
        pathMatch: 'full',
        title: 'Inicio Ciudadano | Arequipa Accesible',
        loadComponent: () =>
          import('./pages/citizen-dashboard/citizen-dashboard').then(
            (module) => module.CitizenDashboard,
          ),
      },
      {
        path: 'nuevo-reporte',
        title: 'Nuevo Reporte | Arequipa Accesible',
        loadComponent: () =>
          import('./pages/new-report/new-report').then((module) => module.NewReport),
      },
      {
        path: 'nuevo-reporte/evidencia',
        title: 'Evidencia y Ubicación | Arequipa Accesible',
        loadComponent: () =>
          import('./pages/report-evidence/report-evidence').then((module) => module.ReportEvidence),
      },
      {
        path: 'nuevo-reporte/descripcion',
        title: 'Descripción del Reporte | Arequipa Accesible',
        loadComponent: () =>
          import('./pages/report-description/report-description').then(
            (module) => module.ReportDescription,
          ),
      },
      {
        path: 'reportes',
        title: 'Mis Reportes | Arequipa Accesible',
        loadComponent: () =>
          import('./pages/my-reports/my-reports').then((module) => module.MyReports),
      },
      {
        path: 'cuenta',
        title: 'Mi Cuenta | Arequipa Accesible',
        loadComponent: () =>
          import('./pages/account/account').then((module) => module.CitizenAccount),
      },
    ],
  },
];
