import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';


export const locationsRoutes: Routes = [
  {
    path: 'locations',
    children: [
      {
        path: '',
        loadComponent: () => import('./screens/locations/locations.component'),
        data: {
          breadcrumbs: [
            { label: _('Settings'), url: '/settings' },
            { label: _('Location'), url: '/' },
          ],
        },
      },
      {
        path: ':parent_id',
        loadComponent: () => import('./screens/locations/locations.component'),
      },
    ],
  },
];
