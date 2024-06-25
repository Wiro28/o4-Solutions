import { CommandRuntimeInfo } from '@event-engine/messaging/command';
import { FleetManagementUpdateCarRuntimeInfo } from '@app/shared/commands/fleet-management/update-car';
import { FleetManagementAddCarToFleetRuntimeInfo } from '@app/shared/commands/fleet-management/add-car-to-fleet';

type CommandRegistry = { [name: string]: CommandRuntimeInfo };

export const commands: CommandRegistry = {
  'FleetManagement.UpdateCar': FleetManagementUpdateCarRuntimeInfo,
  'FleetManagement.AddCarToFleet': FleetManagementAddCarToFleetRuntimeInfo,
};
