import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const contactRoutes: Routes = [
  {
    path: 'contacts',
    loadComponent: () => import('@pages/contacts/contacts.component'),
    title: _('contacts'),
    data: {
      breadcrumbs: [{ label: _('contacts') }],
    },
  },
];
