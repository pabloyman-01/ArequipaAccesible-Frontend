import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Rol } from './api.models';
import { mensajeError } from './api.service';

export const sessionGuard: CanActivateFn = async () => {
  const auth = inject(AuthService),
    router = inject(Router);
  return auth.session() ? true : router.parseUrl('/inicio-sesion');
};
export function roleGuard(rol: Rol): CanActivateChildFn {
  return async () => {
    const auth = inject(AuthService),
      router = inject(Router);
    if (!auth.session()) return router.parseUrl('/inicio-sesion');
    if (auth.recovery()) return router.parseUrl('/inicio-sesion/nueva-contrasena');
    try {
      const p = await auth.refreshProfile();
      if (!p) return router.parseUrl('/inicio-sesion/completar-perfil');
      return p.roles.includes(rol) ? true : router.parseUrl(auth.home());
    } catch (error) {
      auth.error.set(mensajeError(error));
      return router.parseUrl('/inicio-sesion');
    }
  };
}
