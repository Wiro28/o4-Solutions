import { AxiosResponse } from 'axios';
import { Api } from '@frontend/api';
import { useMutation } from '@tanstack/react-query';
import { AddCarToFleetDesc } from '@app/shared/commands/fleet-management/add-car-to-fleet.desc';
import { AddCarToFleet } from '@app/shared/commands/fleet-management/add-car-to-fleet';

export const addCarToFleet = async (
  params: AddCarToFleet
): Promise<AxiosResponse> => {
  return await Api.executeCommand(AddCarToFleetDesc.name, params);
};

export const useAddCarToFleet = (params: AddCarToFleet) => {
  return useMutation({
    mutationKey: [AddCarToFleetDesc.name, params],
    mutationFn: (): Promise<AxiosResponse> => {
      return addCarToFleet(params);
    },
  });
};
