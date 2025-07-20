import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const unitTypesRoutes: Routes = [
  {
    path: 'unit-types',
    loadComponent: () => import('@pages/unit-types/unit-types.component'),
    title: _('unit types'),
    data: {
      breadcrumbs: [
        { label: _('projects'), url: 'projects' },
        { label: _('unit types') },
      ],
    },
  },
];
