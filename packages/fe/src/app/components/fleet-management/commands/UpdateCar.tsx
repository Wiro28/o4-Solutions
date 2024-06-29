import * as React from 'react';
import { useState } from 'react';
import CommandButton, {
  WithCommandButtonProps,
} from '@frontend/app/components/core/CommandButton';
import CommandDialog from '@frontend/app/components/core/CommandDialog';
import { updateCar } from '@frontend/commands/fleet-management/use-update-car';
import { FleetManagementUpdateCarRuntimeInfo } from '@app/shared/commands/fleet-management/update-car';

import { useGetCar } from '@frontend/queries/fleet-management/use-get-car';
import { determineQueryPayload } from '@app/shared/utils/determine-query-payload';
import { FleetManagementGetCarQueryRuntimeInfo } from '@app/shared/queries/fleet-management/get-car';

interface OwnProps {
  vehicleId: string;
}

type UpdateCarProps = OwnProps & WithCommandButtonProps;

const UpdateCar = (props: UpdateCarProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const query = useGetCar(
    determineQueryPayload(props, FleetManagementGetCarQueryRuntimeInfo)
  );

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <CommandButton
        command={FleetManagementUpdateCarRuntimeInfo}
        onClick={handleOpenDialog}
        {...{ ...props.buttonProps }}
      />
      <CommandDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        commandDialogCommand={FleetManagementUpdateCarRuntimeInfo}
        commandFn={updateCar}
        aggregateState={query.isSuccess ? query.data : {}}
      />
    </>
  );
};

export default UpdateCar;
