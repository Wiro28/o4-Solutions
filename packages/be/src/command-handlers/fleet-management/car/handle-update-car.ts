import { Car } from '@app/shared/types/fleet-management/car/car';
import { Command } from '@event-engine/messaging/command';
import { Event } from '@event-engine/messaging/event';
import jexl from '@app/shared/jexl/get-configured-jexl';
import { UpdateCar } from '@app/shared/commands/fleet-management/update-car';
import { carUpdated } from '@app/shared/events/fleet-management/car/car-updated';
import { carAddedToFleet } from '@app/shared/events/fleet-management/car/car-added-to-fleet';

export const handleUpdateCar = async function* (
  car: Partial<Car>,
  command: Command<UpdateCar>,
  deps: object
): AsyncGenerator<Event> {
  const ctx: any = deps;
  ctx['information'] = car;
  ctx['command'] = command.payload;
  ctx['meta'] = command.meta;

  yield carUpdated(await jexl.eval('command', ctx), ctx.meta);

  if (await jexl.eval('command.productionYear', ctx)) {
    yield carAddedToFleet(
      {
        vehicleId: await jexl.eval('command.vehicleId', ctx),
      },
      ctx.meta
    );
  }
};
