import { TypeRegistry } from '@event-engine/infrastructure/TypeRegistry';
import { FleetManagementCarCarVORuntimeInfo } from '@app/shared/types/fleet-management/car/car';
import { FleetManagementCarCarListVORuntimeInfo } from '@app/shared/types/fleet-management/car/car-list';

export const types: TypeRegistry = {
  'FleetManagement.Car.Car': FleetManagementCarCarVORuntimeInfo,
  'FleetManagement.Car.CarList': FleetManagementCarCarListVORuntimeInfo,
};
