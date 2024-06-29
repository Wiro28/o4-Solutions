import { AxiosResponse } from 'axios';
import { Api } from '@frontend/api';
import { useMutation } from '@tanstack/react-query';
import { UpdateCarDesc } from '@app/shared/commands/fleet-management/update-car.desc';
import { UpdateCar } from '@app/shared/commands/fleet-management/update-car';

export const updateCar = async (params: UpdateCar): Promise<AxiosResponse> => {
  return await Api.executeCommand(UpdateCarDesc.name, params);
};

export const useUpdateCar = (params: UpdateCar) => {
  return useMutation({
    mutationKey: [UpdateCarDesc.name, params],
    mutationFn: (): Promise<AxiosResponse> => {
      return updateCar(params);
    },
  });
};
