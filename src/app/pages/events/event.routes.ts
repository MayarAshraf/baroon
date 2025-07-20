import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const eventRoutes: Routes = [
  {
    path: 'event',
    loadComponent: () => import('@pages/events/event.component'),
    title: _('event'),
    data: {
      breadcrumbs: [{ label: _('event') }],
    },
  },
];
