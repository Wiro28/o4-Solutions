import { Query } from '@event-engine/messaging/query';
import { getConfiguredDocumentStore } from '@server/infrastructure/configuredDocumentStore';
import jexl from '@app/shared/jexl/get-configured-jexl';
import { GetCarList } from '@app/shared/queries/fleet-management/get-car-list';
import {
  carList,
  CarList,
} from '@app/shared/types/fleet-management/car/car-list';
import { CarListDesc } from '@app/shared/types/fleet-management/car/car-list.desc';
import {
  INFORMATION_SERVICE_NAME,
  InformationService,
} from '@server/infrastructure/information-service/information-service';
import { getExternalServiceOrThrow } from '@server/extensions/get-external-service';

import { car, Car } from '@app/shared/types/fleet-management/car/car';
import { filters } from '@event-engine/infrastructure/DocumentStore/Filter/index';
import { asyncIteratorToArray } from '@event-engine/infrastructure/helpers/async-iterator-to-array';
import { asyncMap } from '@event-engine/infrastructure/helpers/async-map';

export const resolveGetCarList = async (
  query: Query<GetCarList>,
  deps: object
): Promise<CarList> => {
  const ds = getConfiguredDocumentStore();
  const infoService = getExternalServiceOrThrow<InformationService>(
    INFORMATION_SERVICE_NAME,
    {}
  );

  const cursor = await ds.findDocs<Car>(
    CarListDesc.collection,
    new filters.AnyFilter(),
    undefined,
    undefined,
    undefined
  );

  return asyncIteratorToArray(asyncMap(cursor, ([, d]) => car(d)));
};
