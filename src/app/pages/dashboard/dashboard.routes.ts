import { Route, Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard.component'),
    title: _('dashboard'),
  },
] as Route[];
