import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const SettingsRoutes: Routes = [
  {
    path: 'settings',
    loadComponent: () => import('./all-settings.component'),
    title: _('settings'),
    data: {
      breadcrumbs: [{ label: _('Settings') }],
    },
  },
];
