import { Event } from '@event-engine/messaging/event';
import jexl from '@app/shared/jexl/get-configured-jexl';
import { Car } from '@app/shared/types/fleet-management/car/car';
import {
  IncompleteCarAdded,
  FleetManagementCarIncompleteCarAddedRuntimeInfo,
} from '@app/shared/events/fleet-management/car/incomplete-car-added';
import {
  cleanUndefinedProperties,
  enforceUndefinedProperties,
} from '@event-engine/messaging/message';

export const applyIncompleteCarAdded = async (
  information: Car,
  event: Event<IncompleteCarAdded>
): Promise<Car> => {
  const ctx: any = {};
  ctx['information'] = information;
  ctx['event'] = enforceUndefinedProperties(
    event.payload,
    FleetManagementCarIncompleteCarAddedRuntimeInfo.schema
  );
  ctx['meta'] = event.meta;

  ctx['information'] = {
    ...(await jexl.eval('information', ctx)),
    ...(await jexl.eval('event', ctx)),
  };

  return cleanUndefinedProperties(ctx['information']);
};
