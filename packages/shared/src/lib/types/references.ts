import { CarSchema as FleetManagementCarCarSchema } from '@app/shared/types/fleet-management/car/car.schema';
import { CarListSchema as FleetManagementCarCarListSchema } from '@app/shared/types/fleet-management/car/car-list.schema';

export type references = [
  typeof FleetManagementCarCarSchema,
  typeof FleetManagementCarCarSchema.properties.vehicleId,
  typeof FleetManagementCarCarSchema.properties.brand,
  typeof FleetManagementCarCarSchema.properties.model,
  typeof FleetManagementCarCarSchema.properties.productionYear,
  typeof FleetManagementCarCarSchema.properties.completed,
  typeof FleetManagementCarCarListSchema
];
