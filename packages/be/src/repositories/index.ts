import { AggregateRepository } from '@event-engine/infrastructure/AggregateRepository';
import fleetManagementCar from '@server/repositories/fleet-management/car/repository';

type RepositoryRegistry = {
  [aggregateName: string]: () => AggregateRepository<any>;
};

export const repositories: RepositoryRegistry = {
  'FleetManagement.Car': fleetManagementCar,
};
