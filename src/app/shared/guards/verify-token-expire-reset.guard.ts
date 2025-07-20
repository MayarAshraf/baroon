import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { catchError, of } from 'rxjs';
import { AlertService, AuthService } from '../services';

export const verifyTokenExpireGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const alert = inject(AlertService);
  const router = inject(Router);
  const token = route.paramMap.get('token') as string;

  return authService
    .verifyPassword({ token, checkExpireResetTokenPage: true })
    .pipe(
      catchError((error) => {
        router.navigate(['/auth/login']);
        alert.setMessage({
          severity: 'error',
          detail: _('you must to verify your account again'),
        });
        return of(false);
      })
    );
};
