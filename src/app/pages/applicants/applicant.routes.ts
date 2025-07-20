import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const applicantRoutes: Routes = [
  {
    path: 'applicant',
    loadComponent: () => import('@pages/applicants/applicant.component'),
    title: _('applicant'),
    data: {
      breadcrumbs: [{ label: _('career'), url: 'career' }, { label: _('applicant') }],
    },
  },
];
