import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
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
