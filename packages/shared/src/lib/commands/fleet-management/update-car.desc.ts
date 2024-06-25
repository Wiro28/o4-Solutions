import { AggregateCommandDescription } from '@event-engine/descriptions/descriptions';

export const UpdateCarDesc: AggregateCommandDescription = {
  name: 'FleetManagement.UpdateCar',
  aggregateCommand: true,
  newAggregate: false,
  aggregateName: 'FleetManagement.Car',
  aggregateIdentifier: 'vehicleId',

  _pbBoardId: '5b16766f-afc4-4903-ac14-43ac46c73f57',
  _pbCardId: 'iKXvspvkkobPbEn7NafhqP',
  _pbCreatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbCreatedAt: '2024-06-25T09:54:31.303Z',
  _pbLastUpdatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbLastUpdatedAt: '2024-06-25T09:54:31.303Z',
  _pbVersion: 1,
  _pbLink:
    'https://app.prooph-board.com/inspectio/board/5b16766f-afc4-4903-ac14-43ac46c73f57?cells=iKXvspvkkobPbEn7NafhqP&clicks=1',
};
