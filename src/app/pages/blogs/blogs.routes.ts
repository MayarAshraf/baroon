import { Route, Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const blogsRoutes: Routes = [
  {
    path: 'blogs',
    loadComponent: () => import('./blogs.component'),
    title: _('blogs'),
    data: {
      breadcrumbs: [{ label: _('blogs') }],
    }
  },
] as Route[];
