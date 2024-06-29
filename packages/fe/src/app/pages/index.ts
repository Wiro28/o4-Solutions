import { PageDefinition } from '@frontend/app/pages/page-definitions';
import { Dashboard } from '@frontend/app/pages/core/dashboard';
import { Questions } from '@frontend/app/pages/core/questions';
import { Adminpanel } from '@frontend/app/pages/core/adminpanel';
import { Examplefeature } from '@frontend/app/pages/core/examplefeature';
import { CarOverview as FleetManagementCarOverview } from '@frontend/app/pages/fleet-management/car-overview';
import { CarDetails as FleetManagementCarDetails } from '@frontend/app/pages/fleet-management/car-details';

export type PageRegistry = { [pageName: string]: PageDefinition };

export const pages: PageRegistry = {
  Dashboard: Dashboard,
  Adminpanel: Adminpanel,
  Questions: Questions,
  Examplefeature: Examplefeature,
  'FleetManagement.CarOverview': FleetManagementCarOverview,
  'FleetManagement.CarDetails': FleetManagementCarDetails,
};
