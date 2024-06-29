import { AggregateCommandDescription } from '@event-engine/descriptions/descriptions';

export const AddCarToFleetDesc: AggregateCommandDescription = {
  name: 'FleetManagement.AddCarToFleet',
  aggregateCommand: true,
  newAggregate: true,
  aggregateName: 'FleetManagement.Car',
  aggregateIdentifier: 'vehicleId',

  _pbBoardId: '5b16766f-afc4-4903-ac14-43ac46c73f57',
  _pbCardId: 'dPRAUpX48xSQtVE7zjk13T',
  _pbCreatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbCreatedAt: '2024-06-28T09:15:07.401Z',
  _pbLastUpdatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbLastUpdatedAt: '2024-06-28T09:15:52.223Z',
  _pbVersion: 2,
  _pbLink:
    'https://app.prooph-board.com/inspectio/board/5b16766f-afc4-4903-ac14-43ac46c73f57?cells=dPRAUpX48xSQtVE7zjk13T&clicks=1',
};
