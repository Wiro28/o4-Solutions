import { QueryableStateListDescription } from '@event-engine/descriptions/descriptions';

export const CarListDesc: QueryableStateListDescription = {
  name: 'FleetManagement.Car.CarList',
  isList: true,
  hasIdentifier: true,
  isQueryable: true,

  itemIdentifier: 'vehicleId',
  itemType: 'FleetManagement.Car.Car',
  query: 'FleetManagement.GetCarList',
  collection: 'car_collection',
  _pbBoardId: '5b16766f-afc4-4903-ac14-43ac46c73f57',
  _pbCardId: 'jD17qYSq3oswbZoU9unXZf',
  _pbCreatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbCreatedAt: '2024-06-28T09:14:34.473Z',
  _pbLastUpdatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbLastUpdatedAt: '2024-06-28T09:15:49.492Z',
  _pbVersion: 3,
  _pbLink:
    'https://app.prooph-board.com/inspectio/board/5b16766f-afc4-4903-ac14-43ac46c73f57?cells=jD17qYSq3oswbZoU9unXZf&clicks=1',
};
