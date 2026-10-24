import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { RuntimeConfigService } from './runtime-config.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (!inject(RuntimeConfigService).isApiRequest(request.url)) return next(request);
  const auth = inject(AuthService);
  return from(auth.token()).pipe(
    switchMap((token) =>
      next(token ? request.clone({ setHeaders: { Authorization: 'Bearer ' + token } }) : request),
    ),
  );
};
