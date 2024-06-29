import { CarSchema as FleetManagementCarCarSchema } from '@app/shared/types/fleet-management/car/car.schema';
import { CarListSchema as FleetManagementCarCarListSchema } from '@app/shared/types/fleet-management/car/car-list.schema';

const definitions = {
  '/definitions/fleet-management/car/car': FleetManagementCarCarSchema,
  '/definitions/fleet-management/car/car-list': FleetManagementCarCarListSchema,
};

export default definitions;
