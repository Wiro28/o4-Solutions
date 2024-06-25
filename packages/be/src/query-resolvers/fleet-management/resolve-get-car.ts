import { Query } from '@event-engine/messaging/query';
import { getConfiguredDocumentStore } from '@server/infrastructure/configuredDocumentStore';
import jexl from '@app/shared/jexl/get-configured-jexl';
import { GetCar } from '@app/shared/queries/fleet-management/get-car';
import { car, Car } from '@app/shared/types/fleet-management/car/car';
import { CarDesc } from '@app/shared/types/fleet-management/car/car.desc';
import {
  INFORMATION_SERVICE_NAME,
  InformationService,
} from '@server/infrastructure/information-service/information-service';
import { getExternalServiceOrThrow } from '@server/extensions/get-external-service';
import { NotFoundError } from '@event-engine/messaging/error/not-found-error';

export const resolveGetCar = async (
  query: Query<GetCar>,
  deps: object
): Promise<Car> => {
  const ds = getConfiguredDocumentStore();

  const doc = await ds.getDoc<Car>(CarDesc.collection, query.payload.vehicleId);

  if (!doc) {
    throw new NotFoundError(
      `Car with vehicleId: "${query.payload.vehicleId}" not found!`
    );
  }

  return car(doc);
};
