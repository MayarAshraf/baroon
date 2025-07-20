import { Route } from '@angular/router';
import { SettingsRoutes } from '@pages/all-settings/settings.routes';
import { applicantRoutes } from '@pages/applicants/applicant.routes';
import { blogsRoutes } from '@pages/blogs/blogs.routes';
import { CareerRoutes } from '@pages/careers/carrer.routes';
import { CompaniesRoutes } from '@pages/companies/company.routes';
import { contactRoutes } from '@pages/contacts/contacts.routes';
import { dashboardRoutes } from '@pages/dashboard/dashboard.routes';
import { eventRoutes } from '@pages/events/event.routes';
import { generalSettingRoutes } from '@pages/general-settings/general-settings.routes';
import { locationsRoutes } from '@pages/Locations/locations.routes';
import { lookupRoutes } from '@pages/lookups/lookups.routes';
import { projectRoutes } from '@pages/project/project.routes';
import { sliderItemsRoutes } from '@pages/slider-items/slider-items.routes';
import { sliderRoutes } from '@pages/sliders/slider.routes';
import { unitTypesRoutes } from '@pages/unit-types/unit-types.routes';
import { usersRoutes } from '@pages/users/users.routes';

export default [
  ...dashboardRoutes,
  ...projectRoutes,
  ...sliderRoutes,
  ...contactRoutes,
  ...CompaniesRoutes,
  ...eventRoutes,
  ...generalSettingRoutes,
  ...locationsRoutes,
  ...usersRoutes,
  ...unitTypesRoutes,
  ...applicantRoutes,
  ...CareerRoutes,
  ...blogsRoutes,
  ...lookupRoutes,
  ...sliderItemsRoutes,
  ...SettingsRoutes,
] as Route[];
