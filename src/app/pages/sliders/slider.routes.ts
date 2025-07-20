import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const sliderRoutes: Routes = [
  {
    path: 'slider',
    loadComponent: () => import('@pages/sliders/sliders.component'),
    title: _('slider'),
    data: {
      breadcrumbs: [
        { label: _('Settings'), url: '/settings' },
        { label: _('Slider') },
      ],
    },
  },
];
