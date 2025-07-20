import { Route, Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const generalSettingRoutes: Routes = [
  {
    path: 'general-settings',
    loadComponent: () => import('./general-settings.component'),
    title: _('Settings'),
    data: {
      breadcrumbs: [
        { label: _('Settings'), url: '/settings' },
        { label: _('Genaral Settings') },
      ],
    },
  },
] as Route[];
