import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { AlertService, AuthService } from '../services';

export const HasRoleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alert = inject(AlertService);

  const isAuthorized = route.data.roles.includes(authService.userRole());

  if (!isAuthorized) {
    router.navigateByUrl('dashboard');
    alert.setMessage({
      severity: 'error',
      detail: _('you are not authorized'),
    });
  }

  return isAuthorized || false;
};
