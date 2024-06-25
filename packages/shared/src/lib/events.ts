import { EventRuntimeInfo } from '@event-engine/messaging/event';
import { FleetManagementCarCarUpdatedRuntimeInfo } from '@app/shared/events/fleet-management/car/car-updated';
import { FleetManagementCarCarAddedToFleetRuntimeInfo } from '@app/shared/events/fleet-management/car/car-added-to-fleet';
import { FleetManagementCarIncompleteCarAddedRuntimeInfo } from '@app/shared/events/fleet-management/car/incomplete-car-added';
import { FleetManagementCarCarAddedRuntimeInfo } from '@app/shared/events/fleet-management/car/car-added';

type EventRegistry = { [eventName: string]: EventRuntimeInfo };

export const events: EventRegistry = {
  'FleetManagement.Car.CarUpdated': FleetManagementCarCarUpdatedRuntimeInfo,
  'FleetManagement.Car.CarAddedToFleet':
    FleetManagementCarCarAddedToFleetRuntimeInfo,
  'FleetManagement.Car.IncompleteCarAdded':
    FleetManagementCarIncompleteCarAddedRuntimeInfo,
  'FleetManagement.Car.CarAdded': FleetManagementCarCarAddedRuntimeInfo,
};
