import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const usersRoutes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('@pages/users/users.component'),
    title: _('users'),
    data: {
      breadcrumbs: [
        { label: _('Settings'), url: '/settings' },
        { label: _('users') },
      ],
    },
  },
];
