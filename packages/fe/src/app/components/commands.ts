import React from 'react';
import { WithCommandButtonProps } from '@frontend/app/components/core/CommandButton';
import FleetManagementUpdateCar from '@frontend/app/components/fleet-management/commands/UpdateCar';
import FleetManagementAddCarToFleet from '@frontend/app/components/fleet-management/commands/AddCarToFleet';

export type CommandComponentRegistry = {
  [commandName: string]: React.FunctionComponent<any & WithCommandButtonProps>;
};

export const commands: CommandComponentRegistry = {
  'FleetManagement.UpdateCar': FleetManagementUpdateCar,
  'FleetManagement.AddCarToFleet': FleetManagementAddCarToFleet,
};
