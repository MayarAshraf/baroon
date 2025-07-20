import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { AuthGuard, LoginGuard } from './shared/guards';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [LoginGuard],
    canActivateChild: [LoginGuard],
    loadComponent: () => import('@layout/auth-layout/auth-layout.component'),
    loadChildren: () => import('./auth-child.routes'),
    title: _('login'),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadComponent: () =>
      import('@layout/content-layout/content-layout.component'),
    loadChildren: () => import('./child.routes'),
    data: {
      authGuardRedirect: '/auth/login',
    },
  },
  {
    path: '**',
    loadComponent: () => import('@pages/errors/404/404.component'),
  },
];
