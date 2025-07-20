import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const projectRoutes: Routes = [
  {
    path: 'projects',
    loadComponent: () => import('@pages/project/projects.component'),
    title: _('projects'),
    data: {
      breadcrumbs: [{ label: _('projects') }],
    },
  },
];
