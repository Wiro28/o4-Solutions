import { Car } from '@app/shared/types/fleet-management/car/car';
import { Command } from '@event-engine/messaging/command';
import { Event } from '@event-engine/messaging/event';
import jexl from '@app/shared/jexl/get-configured-jexl';
import { AddCarToFleet } from '@app/shared/commands/fleet-management/add-car-to-fleet';
import { carAddedToFleet } from '@app/shared/events/fleet-management/car/car-added-to-fleet';
import { incompleteCarAdded } from '@app/shared/events/fleet-management/car/incomplete-car-added';
import { carAdded } from '@app/shared/events/fleet-management/car/car-added';

export const handleAddCarToFleet = async function* (
  car: Partial<Car>,
  command: Command<AddCarToFleet>,
  deps: object
): AsyncGenerator<Event> {
  const ctx: any = deps;
  ctx['information'] = car;
  ctx['command'] = command.payload;
  ctx['meta'] = command.meta;

  if (await jexl.eval("command.brand == 'Audi'", ctx)) {
    throw new Error(
      '' + (await jexl.eval("'Cannot create cars for Audi'", ctx))
    );
  }

  if (!(await jexl.eval('command.productionYear', ctx))) {
    yield incompleteCarAdded(await jexl.eval('command', ctx), ctx.meta);
    return;
  }

  if (await jexl.eval('command.productionYear', ctx)) {
    yield carAdded(await jexl.eval('command', ctx), ctx.meta);
    yield carAddedToFleet(
      {
        vehicleId: await jexl.eval('command.vehicleId', ctx),
      },
      ctx.meta
    );
  }
};
