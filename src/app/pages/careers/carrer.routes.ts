import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const CareerRoutes: Routes = [
  {
    path: 'career',
    loadComponent: () => import('@pages/careers/carrer.component'),
    title: _('career'),
    data: {
      breadcrumbs: [{ label: _('career') }],
    },
  },
];
