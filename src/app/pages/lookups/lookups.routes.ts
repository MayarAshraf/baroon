import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const lookupRoutes: Routes = [
  {
    path: 'lookups',
    loadComponent: () => import('@pages/lookups/lookups.component'),
    title: _('lookups'),
    data: {
      breadcrumbs: [
        { label: _('Settings'), url: '/settings' },
        { label: _('lookups') },
      ],
    },
  },
  {
    path: 'lookups/:slug/:parent_id',
    loadComponent: () =>
      import('@pages/lookups/lookups-child/lookups-child.component'),
    title: _('lookups'),
    data: {
      breadcrumbs: [{ label: _('lookups') }],
    },
  },
];
