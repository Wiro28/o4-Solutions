import { AggregateEventDescription } from '@event-engine/descriptions/descriptions';

export const CarAddedDesc: AggregateEventDescription = {
  name: 'FleetManagement.Car.CarAdded',
  aggregateEvent: true,
  public: false,
  aggregateState: 'FleetManagement.Car.Car',
  aggregateName: 'FleetManagement.Car',
  aggregateIdentifier: 'vehicleId',
  _pbBoardId: '5b16766f-afc4-4903-ac14-43ac46c73f57',
  _pbCardId: 's1VdrFT8D1TtXwJjh2eFAu',
  _pbCreatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbCreatedAt: '2024-06-25T09:55:14.325Z',
  _pbLastUpdatedBy: 'ce3224e1-8e77-45e3-a1e9-86d8188d0cc5',
  _pbLastUpdatedAt: '2024-06-25T09:56:44.533Z',
  _pbVersion: 2,
  _pbLink:
    'https://app.prooph-board.com/inspectio/board/5b16766f-afc4-4903-ac14-43ac46c73f57?cells=s1VdrFT8D1TtXwJjh2eFAu&clicks=1',
};
