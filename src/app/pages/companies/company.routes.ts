import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const CompaniesRoutes: Routes = [
  {
    path: 'sister_company',
    loadComponent: () => import('@pages/companies/company.component'),
    title: _('sister company'),
    data: {
      breadcrumbs: [{ label: _('sister company') }],
    },
  },
];
