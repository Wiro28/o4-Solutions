import { ApplyFunctionRegistry } from '@event-engine/infrastructure/AggregateRepository';
import { Car } from '@app/shared/types/fleet-management/car/car';
import { applyCarUpdated } from '@server/event-reducers/fleet-management/car/apply-car-updated';
import { applyCarAddedToFleet } from '@server/event-reducers/fleet-management/car/apply-car-added-to-fleet';
import { applyIncompleteCarAdded } from '@server/event-reducers/fleet-management/car/apply-incomplete-car-added';
import { applyCarAdded } from '@server/event-reducers/fleet-management/car/apply-car-added';

const reducers: ApplyFunctionRegistry<Car> = {
  'FleetManagement.Car.CarUpdated': applyCarUpdated,
  'FleetManagement.Car.CarAddedToFleet': applyCarAddedToFleet,
  'FleetManagement.Car.IncompleteCarAdded': applyIncompleteCarAdded,
  'FleetManagement.Car.CarAdded': applyCarAdded,
};

export default reducers;
