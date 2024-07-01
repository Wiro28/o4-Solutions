import { QueryableStateDescription } from '@event-engine/descriptions/descriptions';

export const CarDesc: QueryableStateDescription = {
  name: 'FleetManagement.Car.Car',
  isList: false,
  hasIdentifier: true,
  isQueryable: true,
  identifier: 'vehicleId',

  query: 'FleetManagement.GetCar',
  collection: 'car_collection',
  _pbBoardId: '5b16766f-afc4-4903-ac14-43ac46c73f57',
  _pbCardId: 'eLgTqJ8ETwmTDudnEvzF6z',
  _pbCreatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbCreatedAt: '2024-06-28T09:14:07.014Z',
  _pbLastUpdatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbLastUpdatedAt: '2024-06-28T09:15:50.633Z',
  _pbVersion: 4,
  _pbLink:
    'https://app.prooph-board.com/inspectio/board/5b16766f-afc4-4903-ac14-43ac46c73f57?cells=eLgTqJ8ETwmTDudnEvzF6z&clicks=1',
};