import { CommandHandlerRegistry } from '@event-engine/infrastructure/commandHandling';
import { handleUpdateCar as handleFleetManagementUpdateCar } from '@server/command-handlers/fleet-management/car/handle-update-car';
import { handleAddCarToFleet as handleFleetManagementAddCarToFleet } from '@server/command-handlers/fleet-management/car/handle-add-car-to-fleet';

export const commandHandlers: CommandHandlerRegistry = {
  'FleetManagement.UpdateCar': handleFleetManagementUpdateCar,
  'FleetManagement.AddCarToFleet': handleFleetManagementAddCarToFleet,
};
