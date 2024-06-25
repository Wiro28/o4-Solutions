import { Event } from '@event-engine/messaging/event';
import jexl from '@app/shared/jexl/get-configured-jexl';
import { Car } from '@app/shared/types/fleet-management/car/car';
import {
  CarAddedToFleet,
  FleetManagementCarCarAddedToFleetRuntimeInfo,
} from '@app/shared/events/fleet-management/car/car-added-to-fleet';
import {
  cleanUndefinedProperties,
  enforceUndefinedProperties,
} from '@event-engine/messaging/message';

export const applyCarAddedToFleet = async (
  information: Car,
  event: Event<CarAddedToFleet>
): Promise<Car> => {
  const ctx: any = {};
  ctx['information'] = information;
  ctx['event'] = enforceUndefinedProperties(
    event.payload,
    FleetManagementCarCarAddedToFleetRuntimeInfo.schema
  );
  ctx['meta'] = event.meta;

  ctx['information'] = {
    ...(await jexl.eval('information', ctx)),
    ...(await jexl.eval('event', ctx)),
  };

  return cleanUndefinedProperties(ctx['information']);
};
