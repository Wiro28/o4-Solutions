import { Event } from '@event-engine/messaging/event';
import jexl from '@app/shared/jexl/get-configured-jexl';
import { Car } from '@app/shared/types/fleet-management/car/car';
import {
  CarUpdated,
  FleetManagementCarCarUpdatedRuntimeInfo,
} from '@app/shared/events/fleet-management/car/car-updated';
import {
  cleanUndefinedProperties,
  enforceUndefinedProperties,
} from '@event-engine/messaging/message';

export const applyCarUpdated = async (
  information: Car,
  event: Event<CarUpdated>
): Promise<Car> => {
  const ctx: any = {};
  ctx['information'] = information;
  ctx['event'] = enforceUndefinedProperties(
    event.payload,
    FleetManagementCarCarUpdatedRuntimeInfo.schema
  );
  ctx['meta'] = event.meta;

  ctx['information'] = {
    ...(await jexl.eval('information', ctx)),
    ...(await jexl.eval('event', ctx)),
    completed: await jexl.eval('!(event.productionYear == undefined)', ctx),
  };

  return cleanUndefinedProperties(ctx['information']);
};
