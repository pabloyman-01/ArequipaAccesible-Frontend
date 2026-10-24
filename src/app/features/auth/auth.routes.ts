import { sessionGuard } from '../../core/auth.guard';
import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'confirmar',
    loadComponent: () => import('./pages/confirm/confirm').then((m) => m.Confirm),
  },
  {
    path: 'nueva-contrasena',
    loadComponent: () => import('./pages/new-password/new-password').then((m) => m.NewPassword),
  },
  {
    path: 'completar-perfil',
    canActivate: [sessionGuard],
    loadComponent: () => import('../../shared/profile/profile').then((m) => m.Profile),
  },
  {
    path: '',
    title: 'Iniciar Sesión | Arequipa Accesible',
    loadComponent: () => import('./pages/login/login').then((module) => module.Login),
  },
  {
    path: 'registro',
    title: 'Registro Ciudadano | Arequipa Accesible',
    loadComponent: () => import('./pages/register/register').then((module) => module.Register),
  },
  {
    path: 'recuperar-contrasena',
    title: 'Recuperar Contraseña | Arequipa Accesible',
    loadComponent: () =>
      import('./pages/password-recovery/password-recovery').then(
        (module) => module.PasswordRecovery,
      ),
  },
];
