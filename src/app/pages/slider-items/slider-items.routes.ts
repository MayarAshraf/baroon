import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

export const sliderItemsRoutes: Routes = [
  {
    path: 'slider-items',
    loadComponent: () => import('@pages/slider-items/slider-items.component'),
    title: _('slider items'),
    data: {
      breadcrumbs: [
        { label: _('Settings'), url: '/settings' },
        { label: _('Slider Items') },
      ],
    },
  },
];
